#!/bin/bash
# =============================================================================
# VPS Initial Setup Script for DataMatrix
# =============================================================================
# Run this ONCE on a fresh Ubuntu 22.04/24.04 VPS
# Usage: sudo bash vps-setup.sh
#
# Prerequisites:
#   - Fresh Ubuntu 22.04 or 24.04 LTS
#   - Root or sudo access
#   - Domain A record pointing to this server's IP
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration - MODIFY THESE
# ---------------------------------------------------------------------------
DOMAIN="yourdomain.com"
SSL_EMAIL="admin@yourdomain.com"
DEPLOY_USER="deploy"
APP_DIR="/var/www/datamatrix"
GIT_REPO="git@github.com:your-username/datamatrix.git"
NODE_VERSION="20"  # LTS version

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ---------------------------------------------------------------------------
# Check if running as root
# ---------------------------------------------------------------------------
if [ "$EUID" -ne 0 ]; then
    log_error "Please run as root or with sudo"
    exit 1
fi

log_info "========================================="
log_info "Starting VPS setup for DataMatrix"
log_info "========================================="

# ---------------------------------------------------------------------------
# Step 1: System Update
# ---------------------------------------------------------------------------
log_info "Step 1: Updating system packages..."
apt update && apt upgrade -y

# ---------------------------------------------------------------------------
# Step 2: Install Essential Packages
# ---------------------------------------------------------------------------
log_info "Step 2: Installing essential packages..."
apt install -y \
    curl \
    wget \
    git \
    build-essential \
    ufw \
    fail2ban \
    htop \
    ncdu

# ---------------------------------------------------------------------------
# Step 3: Create Deploy User
# ---------------------------------------------------------------------------
log_info "Step 3: Creating deploy user..."
if id "$DEPLOY_USER" &>/dev/null; then
    log_warn "User $DEPLOY_USER already exists"
else
    useradd -m -s /bin/bash "$DEPLOY_USER"
    usermod -aG sudo "$DEPLOY_USER"
    log_info "Created user: $DEPLOY_USER"

    # Set up SSH for deploy user (copy from root)
    mkdir -p /home/$DEPLOY_USER/.ssh
    if [ -f /root/.ssh/authorized_keys ]; then
        cp /root/.ssh/authorized_keys /home/$DEPLOY_USER/.ssh/
    fi
    chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
    chmod 700 /home/$DEPLOY_USER/.ssh
    chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys 2>/dev/null || true
fi

# ---------------------------------------------------------------------------
# Step 4: Install Node.js
# ---------------------------------------------------------------------------
log_info "Step 4: Installing Node.js ${NODE_VERSION}.x..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt install -y nodejs

log_info "Node.js version: $(node --version)"
log_info "npm version: $(npm --version)"

# ---------------------------------------------------------------------------
# Step 5: Install PM2 Globally
# ---------------------------------------------------------------------------
log_info "Step 5: Installing PM2..."
npm install -g pm2

# Configure PM2 to start on boot
pm2 startup systemd -u $DEPLOY_USER --hp /home/$DEPLOY_USER

# ---------------------------------------------------------------------------
# Step 6: Install Nginx
# ---------------------------------------------------------------------------
log_info "Step 6: Installing Nginx..."
apt install -y nginx

# Remove default site
rm -f /etc/nginx/sites-enabled/default

systemctl enable nginx
systemctl start nginx

# ---------------------------------------------------------------------------
# Step 7: Install Certbot
# ---------------------------------------------------------------------------
log_info "Step 7: Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# ---------------------------------------------------------------------------
# Step 8: Install PostgreSQL
# ---------------------------------------------------------------------------
log_info "Step 8: Installing PostgreSQL..."
apt install -y postgresql postgresql-contrib

# Start PostgreSQL
systemctl enable postgresql
systemctl start postgresql

# Create database and user
log_info "Creating PostgreSQL database and user..."
sudo -u postgres psql -c "CREATE USER datamatrix_user WITH PASSWORD 'CHANGE_THIS_PASSWORD';" 2>/dev/null || log_warn "User may already exist"
sudo -u postgres psql -c "CREATE DATABASE datamatrix_prod OWNER datamatrix_user;" 2>/dev/null || log_warn "Database may already exist"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE datamatrix_prod TO datamatrix_user;"

log_warn "IMPORTANT: Change the database password in PostgreSQL and update /etc/datamatrix/.env"

# ---------------------------------------------------------------------------
# Step 9: Configure Firewall (UFW)
# ---------------------------------------------------------------------------
log_info "Step 9: Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

log_info "Firewall rules:"
ufw status

# ---------------------------------------------------------------------------
# Step 10: Create Application Directories
# ---------------------------------------------------------------------------
log_info "Step 10: Creating application directories..."

# Application directory
mkdir -p $APP_DIR
chown -R $DEPLOY_USER:$DEPLOY_USER $APP_DIR

# Environment config directory
mkdir -p /etc/datamatrix
chmod 750 /etc/datamatrix
chown root:$DEPLOY_USER /etc/datamatrix

# Log directory
mkdir -p /var/log/datamatrix
chown -R $DEPLOY_USER:$DEPLOY_USER /var/log/datamatrix

# Backup directory
mkdir -p /var/www/datamatrix-backups
chown -R $DEPLOY_USER:$DEPLOY_USER /var/www/datamatrix-backups

# Certbot webroot
mkdir -p /var/www/certbot

# ---------------------------------------------------------------------------
# Step 11: Create Environment File Template
# ---------------------------------------------------------------------------
log_info "Step 11: Creating environment file template..."

cat > /etc/datamatrix/.env << 'EOF'
# =============================================================================
# PRODUCTION ENVIRONMENT - DataMatrix
# =============================================================================
# IMPORTANT: Update all placeholder values before deploying
# Permissions: chmod 600 /etc/datamatrix/.env
# =============================================================================

NODE_ENV=production
PORT=3000
HOSTNAME=127.0.0.1

# Database
DATABASE_URL="postgresql://datamatrix_user:CHANGE_THIS_PASSWORD@localhost:5432/datamatrix_prod?schema=public"

# NextAuth - Generate secrets with: openssl rand -base64 32
NEXTAUTH_SECRET="GENERATE_ME_openssl_rand_base64_32"
NEXTAUTH_URL="https://yourdomain.com"

# Session
SESSION_SECRET="GENERATE_ME_openssl_rand_base64_32"

# Application
NEXT_API_URL="https://yourdomain.com"
APP_DOMAIN="yourdomain.com"
SSL_EMAIL="admin@yourdomain.com"

# Logging
LOG_LEVEL=error
DEBUG_PRISMA=false

# Public variables
NEXT_PUBLIC_APP_NAME="DataMatrix"
NEXT_PUBLIC_API_URL="https://yourdomain.com"
EOF

chmod 600 /etc/datamatrix/.env
chown root:$DEPLOY_USER /etc/datamatrix/.env

log_warn "IMPORTANT: Edit /etc/datamatrix/.env with your actual values!"

# ---------------------------------------------------------------------------
# Step 12: Configure Nginx
# ---------------------------------------------------------------------------
log_info "Step 12: Setting up Nginx configuration..."

# Create a basic HTTP config first (SSL will be added by Certbot)
cat > /etc/nginx/sites-available/datamatrix << EOF
# Temporary HTTP-only config (Certbot will modify this)
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};

    # Certbot challenge location
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Proxy to Next.js during initial setup
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/datamatrix /etc/nginx/sites-enabled/

nginx -t && systemctl reload nginx

# ---------------------------------------------------------------------------
# Step 13: Configure Fail2ban
# ---------------------------------------------------------------------------
log_info "Step 13: Configuring Fail2ban..."

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
maxretry = 3

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
EOF

systemctl enable fail2ban
systemctl restart fail2ban

# ---------------------------------------------------------------------------
# Step 14: Configure Log Rotation
# ---------------------------------------------------------------------------
log_info "Step 14: Configuring log rotation..."

cat > /etc/logrotate.d/datamatrix << 'EOF'
/var/log/datamatrix/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 deploy deploy
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
log_info "========================================="
log_info "VPS Setup Complete!"
log_info "========================================="
echo ""
log_info "Next steps:"
echo "  1. Edit /etc/datamatrix/.env with your production values:"
echo "     - Generate secrets: openssl rand -base64 32"
echo "     - Set database password"
echo "     - Update domain name"
echo ""
echo "  2. Clone your repository:"
echo "     sudo -u $DEPLOY_USER git clone $GIT_REPO $APP_DIR"
echo ""
echo "  3. Install dependencies and build:"
echo "     cd $APP_DIR"
echo "     sudo -u $DEPLOY_USER npm ci"
echo "     sudo -u $DEPLOY_USER npm run prod:build"
echo ""
echo "  4. Run database migrations:"
echo "     sudo -u $DEPLOY_USER npx prisma migrate deploy"
echo ""
echo "  5. Start the application:"
echo "     sudo -u $DEPLOY_USER pm2 start ecosystem.config.cjs --env production"
echo "     sudo -u $DEPLOY_USER pm2 save"
echo ""
echo "  6. Obtain SSL certificate:"
echo "     sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --email ${SSL_EMAIL} --agree-tos"
echo ""
echo "  7. Replace Nginx config with the production version from deploy/nginx.conf"
echo ""
echo "  8. Test SSL renewal:"
echo "     sudo certbot renew --dry-run"
echo ""
log_warn "Don't forget to:"
echo "  - Change PostgreSQL password"
echo "  - Update /etc/datamatrix/.env"
echo "  - Set up SSH key for git access"
echo ""
log_info "Server IP: $(curl -s ifconfig.me)"
