#!/bin/bash
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
        log_error "Create it from .env.prod.example"
        exit 1
    fi

    if ! command -v node &> /dev/null; then
        log_error "Node.js not found"
        exit 1
    fi

    if ! command -v pm2 &> /dev/null; then
        log_error "PM2 not found. Install with: npm install -g pm2"
        exit 1
    fi
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

    # Source environment variables
    set -a
    source "$ENV_FILE"
    set +a

    # Deploy Prisma migrations
    npx prisma migrate deploy

    # Generate Prisma client
    npx prisma generate

    log_info "Migrations completed"
}

build_app() {
    log_info "Building application..."
    cd "$APP_DIR"

    # Source environment variables for build
    set -a
    source "$ENV_FILE"
    set +a

    # Build Next.js app
    npm run prod:build

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

    # Check if PM2 process exists
    if pm2 list | grep -q "datamatrix"; then
        # Reload with zero-downtime restart
        pm2 reload datamatrix --update-env
        log_info "Application reloaded (zero-downtime)"
    else
        # Start fresh
        pm2 start ecosystem.config.cjs --env production
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
