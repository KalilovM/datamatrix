#!/usr/bin/env bash
# =============================================================================
# DataMatrix Deployment Script
# =============================================================================
# Usage: ./scripts/deploy.sh
# Run on VPS to deploy latest code from git
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
APP_DIR="/var/www/datamatrix"
ENV_FILE="/etc/datamatrix/.env"
LOG_DIR="/var/log/datamatrix"
BACKUP_DIR="/var/www/datamatrix-backups"
MAX_BACKUPS=5

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ---------------------------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------------------------
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking requirements..."

    if [ ! -d "$APP_DIR" ]; then
        log_error "Application directory not found: $APP_DIR"
        exit 1
    fi

    if [ ! -f "$ENV_FILE" ]; then
        log_error "Environment file not found: $ENV_FILE"
        log_error "Create it from .env.example (or run scripts/vps-setup.sh to generate it automatically)"
        exit 1
    fi

    if ! command -v node &> /dev/null; then
        log_error "Node.js not found"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        log_error "npm not found"
        exit 1
    fi

    if ! command -v git &> /dev/null; then
        log_error "git not found"
        exit 1
    fi

    if ! command -v pm2 &> /dev/null; then
        log_error "PM2 not found. Install with: npm install -g pm2"
        exit 1
    fi

    local owner
    owner="$(stat -c '%U' "$APP_DIR" 2>/dev/null || echo unknown)"
    if [ "$owner" != "$(whoami)" ]; then
        log_warn "${APP_DIR} owner is '$owner' (current user: $(whoami))."
        log_warn "If deploy fails, run as root: chown -R $(whoami):$(whoami) $APP_DIR"
    fi
}

load_env() {
    # Normalize potential CRLF line endings (common when edited from Windows)
    if grep -q $'\r' "$ENV_FILE"; then
        log_warn "Detected CRLF in $ENV_FILE, normalizing to LF"
        sed -i 's/\r$//' "$ENV_FILE"
    fi

    set -a
    # shellcheck disable=SC1090
    source "$ENV_FILE"
    set +a
}

check_database_connection() {
    log_info "Checking database connection from DATABASE_URL..."
    load_env

    if [ -z "${DATABASE_URL:-}" ]; then
        log_error "DATABASE_URL is empty in $ENV_FILE"
        exit 1
    fi

    if ! command -v psql &> /dev/null; then
        log_warn "psql is not installed; skipping preflight DB connectivity check"
        return 0
    fi

    if ! psql "$DATABASE_URL" -c "SELECT 1;" >/dev/null 2>&1; then
        log_error "Failed to connect to PostgreSQL using DATABASE_URL from $ENV_FILE"
        log_error "If password contains special URL characters, URL-encode it in DATABASE_URL"
        log_error "Then retry deployment"
        exit 1
    fi

    log_info "Database connection check passed"
}

backup_current() {
    log_info "Creating backup..."

    mkdir -p "$BACKUP_DIR"

    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_NAME="backup_${TIMESTAMP}"

    if [ -d "$APP_DIR/.next" ]; then
        cp -r "$APP_DIR/.next" "$BACKUP_DIR/$BACKUP_NAME"
        log_info "Backup created: $BACKUP_DIR/$BACKUP_NAME"
    fi

    # Cleanup old backups (keep last MAX_BACKUPS)
    cd "$BACKUP_DIR"
    ls -t | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm -rf
}

pull_latest() {
    log_info "Pulling latest code..."
    cd "$APP_DIR"

    # Mark repository as safe for current user to avoid 'dubious ownership' blocks
    git config --global --add safe.directory "$APP_DIR" || true

    # Stash any local changes
    git stash --quiet || true

    # Pull latest from origin
    git pull origin main

    log_info "Current commit: $(git rev-parse --short HEAD)"
}

install_dependencies() {
    log_info "Installing dependencies..."
    cd "$APP_DIR"

    # Clean install for production
    npm ci --production=false
}

run_migrations() {
    log_info "Running database migrations..."
    cd "$APP_DIR"

    load_env

    # Deploy Prisma migrations
    npx prisma migrate deploy

    # Generate Prisma client
    npx prisma generate

    log_info "Migrations completed"
}

build_app() {
    log_info "Building application..."
    cd "$APP_DIR"

    load_env

    # Build Next.js app
    npm run build

    log_info "Build completed"
}

copy_static_files() {
    log_info "Copying static files for standalone output..."
    cd "$APP_DIR"

    # Copy public folder to standalone
    if [ -d "public" ]; then
        cp -r public .next/standalone/public
    fi

    # Copy static assets
    if [ -d ".next/static" ]; then
        mkdir -p .next/standalone/.next
        cp -r .next/static .next/standalone/.next/
    fi
}

restart_app() {
    log_info "Restarting application..."
    cd "$APP_DIR"
    load_env

    # Check if PM2 process exists
    if pm2 list | grep -q "datamatrix"; then
        # Reload with zero-downtime restart
        pm2 reload ecosystem.config.cjs --only datamatrix --env production --update-env
        log_info "Application reloaded (zero-downtime)"
    else
        # Start fresh
        pm2 start ecosystem.config.cjs --only datamatrix --env production --update-env
        log_info "Application started"
    fi

    # Save PM2 process list
    pm2 save
}

health_check() {
    log_info "Running health check..."

    # Wait for app to be ready
    sleep 5

    # Check health endpoint
    for i in {1..10}; do
        if curl -sf http://127.0.0.1:3000/api/health > /dev/null 2>&1; then
            log_info "Health check passed!"
            return 0
        fi
        log_warn "Health check attempt $i/10 failed, retrying..."
        sleep 2
    done

    log_error "Health check failed after 10 attempts"
    log_warn "Check logs: pm2 logs datamatrix"
    return 1
}

rollback() {
    log_error "Deployment failed, attempting rollback..."

    # Find latest backup
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR" | head -n1)

    if [ -n "$LATEST_BACKUP" ] && [ -d "$BACKUP_DIR/$LATEST_BACKUP" ]; then
        log_info "Rolling back to: $LATEST_BACKUP"
        rm -rf "$APP_DIR/.next"
        cp -r "$BACKUP_DIR/$LATEST_BACKUP" "$APP_DIR/.next"
        pm2 reload datamatrix --update-env
        log_info "Rollback completed"
    else
        log_error "No backup available for rollback"
    fi
}

# ---------------------------------------------------------------------------
# Main Deployment Flow
# ---------------------------------------------------------------------------
main() {
    log_info "========================================="
    log_info "Starting deployment..."
    log_info "========================================="

    check_requirements
    backup_current
    pull_latest
    install_dependencies
    check_database_connection
    run_migrations
    build_app
    copy_static_files
    restart_app

    if health_check; then
        log_info "========================================="
        log_info "Deployment completed successfully!"
        log_info "========================================="
    else
        rollback
        exit 1
    fi
}

# Run main function
main "$@"
