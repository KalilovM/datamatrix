#!/usr/bin/env bash
# =============================================================================
# DataMatrix VPS Bootstrap (Ubuntu 22.04/24.04)
# =============================================================================
# Run on the server:
#   sudo bash scripts/vps-setup.sh all
#   sudo bash scripts/vps-setup.sh dev
#   sudo bash scripts/vps-setup.sh prod
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./lib/deploy-targets.sh
source "${SCRIPT_DIR}/lib/deploy-targets.sh"

TARGET="${1:-all}"
NODE_VERSION="${NODE_VERSION:-20}"
DEPLOY_USER="${DEPLOY_USER:-marlen}"
SSL_EMAIL="${SSL_EMAIL:-admin@alonamoda.com}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

require_root() {
    if [ "${EUID}" -ne 0 ]; then
        log_error "Run this script as root (sudo)."
        exit 1
    fi
}

check_dns() {
    local resolved
    resolved="$(getent ahostsv4 "${DOMAIN}" | awk '{print $1}' | sort -u | tr '\n' ' ')"

    if [ -z "${resolved}" ]; then
        log_warn "Could not resolve ${DOMAIN}. SSL issuance may fail until DNS is propagated."
        return
    fi

    if [[ " ${resolved} " != *" ${SERVER_IP} "* ]]; then
        log_warn "${DOMAIN} does not currently resolve to ${SERVER_IP}. Resolved: ${resolved}"
    else
        log_info "DNS check passed: ${DOMAIN} -> ${SERVER_IP}"
    fi
}

install_base_packages() {
    log_info "Updating system and installing base packages..."
    apt update
    DEBIAN_FRONTEND=noninteractive apt upgrade -y
    DEBIAN_FRONTEND=noninteractive apt install -y \
        ca-certificates \
        curl \
        git \
        gnupg \
                openssl \
        build-essential \
        ufw \
        fail2ban \
        nginx \
        certbot \
        postgresql \
        postgresql-contrib
}

ensure_tls_params() {
        if [ ! -f /etc/letsencrypt/options-ssl-nginx.conf ] || [ ! -f /etc/letsencrypt/ssl-dhparams.pem ]; then
                log_info "Installing recommended TLS parameters..."
                mkdir -p /etc/letsencrypt
                curl -fsSL \
                    https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
                    -o /etc/letsencrypt/options-ssl-nginx.conf
                curl -fsSL \
                    https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem \
                    -o /etc/letsencrypt/ssl-dhparams.pem
        fi
}

install_node_pm2() {
    log_info "Installing Node.js ${NODE_VERSION}.x and PM2..."
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash -
    DEBIAN_FRONTEND=noninteractive apt install -y nodejs
    npm install -g pm2

    log_info "Node: $(node --version)"
    log_info "npm: $(npm --version)"
    log_info "pm2: $(pm2 --version)"
}

setup_deploy_user() {
    log_info "Ensuring deploy user exists..."
    if ! id "${DEPLOY_USER}" &>/dev/null; then
        useradd -m -s /bin/bash "${DEPLOY_USER}"
        usermod -aG sudo "${DEPLOY_USER}"
    fi

    mkdir -p "/home/${DEPLOY_USER}/.ssh"
    if [ -f /root/.ssh/authorized_keys ] && [ ! -f "/home/${DEPLOY_USER}/.ssh/authorized_keys" ]; then
        cp /root/.ssh/authorized_keys "/home/${DEPLOY_USER}/.ssh/authorized_keys"
    fi

    chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "/home/${DEPLOY_USER}/.ssh"
    chmod 700 "/home/${DEPLOY_USER}/.ssh"
    [ -f "/home/${DEPLOY_USER}/.ssh/authorized_keys" ] && chmod 600 "/home/${DEPLOY_USER}/.ssh/authorized_keys"
}

setup_firewall_and_services() {
    log_info "Configuring services and firewall..."
    systemctl enable nginx postgresql fail2ban certbot.timer
    systemctl start nginx postgresql fail2ban certbot.timer

    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow "${SSH_PORT}/tcp"
    ufw allow 'Nginx Full'
    ufw --force enable
}

setup_directories() {
    log_info "Creating directories for ${TARGET_LABEL}..."
    mkdir -p "${APP_DIR}" "${BACKUP_DIR}" "${LOG_DIR}" "${ENV_DIR}" /var/www/certbot
    chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${APP_DIR}" "${BACKUP_DIR}" "${LOG_DIR}" /var/www/certbot
    chown root:"${DEPLOY_USER}" "${ENV_DIR}"
    chmod 750 "${ENV_DIR}"
}

database_exists() {
    sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1
}

database_user_exists() {
    sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1
}

setup_postgres() {
    log_info "Configuring PostgreSQL database/user for ${TARGET_LABEL}..."

    if [ -f "${ENV_FILE}" ]; then
        log_info "Existing environment file found at ${ENV_FILE}; keeping current database credentials"
        return
    fi

    DB_PASSWORD="$(openssl rand -hex 24)"

    if database_user_exists; then
        sudo -u postgres psql -c "ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';"
    else
        sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';"
    fi

    if ! database_exists; then
        sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"
    fi

    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"
}

write_env_file() {
    if [ -f "${ENV_FILE}" ]; then
        log_info "Skipping env creation for ${TARGET_LABEL}; ${ENV_FILE} already exists"
        return
    fi

    log_info "Creating ${ENV_FILE}..."
    NEXTAUTH_SECRET="$(openssl rand -base64 32)"
    SESSION_SECRET="$(openssl rand -base64 32)"

    cat > "${ENV_FILE}" <<EOF
NODE_ENV=production
APP_ENV=${TARGET_ENV}
PORT=${DEFAULT_PORT}
HOSTNAME=${APP_HOST}
DATAMATRIX_PM2_APP_NAME=${PM2_APP_NAME}
DATAMATRIX_LOG_DIR=${LOG_DIR}

DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public"

NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
NEXTAUTH_URL="https://${DOMAIN}"

SESSION_SECRET="${SESSION_SECRET}"

NEXT_API_URL="https://${DOMAIN}"
APP_DOMAIN="${DOMAIN}"
SSL_EMAIL="${SSL_EMAIL}"

LOG_LEVEL=error
DEBUG_PRISMA=false

NEXT_PUBLIC_APP_NAME="DataMatrix"
NEXT_PUBLIC_API_URL="https://${DOMAIN}"
EOF

    chmod 600 "${ENV_FILE}"
    chown root:"${DEPLOY_USER}" "${ENV_FILE}"
}

write_nginx_http_bootstrap() {
    log_info "Writing initial HTTP Nginx config for ${TARGET_LABEL}..."
    cat > "/etc/nginx/sites-available/${NGINX_SITE_NAME}" <<EOF
server {
        listen 80;
        listen [::]:80;
        server_name ${DOMAIN};

        location /.well-known/acme-challenge/ {
                root /var/www/certbot;
        }

        location / {
                proxy_pass http://${APP_HOST}:${DEFAULT_PORT};
                proxy_http_version 1.1;
                proxy_set_header Upgrade \$http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host \$host;
                proxy_set_header X-Real-IP \$remote_addr;
                proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto \$scheme;
                proxy_cache_bypass \$http_upgrade;
        }
}
EOF

    rm -f /etc/nginx/sites-enabled/default
    ln -sf "/etc/nginx/sites-available/${NGINX_SITE_NAME}" "/etc/nginx/sites-enabled/${NGINX_SITE_NAME}"
    nginx -t
    systemctl reload nginx
}

issue_ssl_certificate() {
    log_info "Issuing Let's Encrypt certificate..."
    certbot certonly --webroot \
        -w /var/www/certbot \
        -d "${DOMAIN}" \
        --email "${SSL_EMAIL}" \
        --agree-tos \
        --no-eff-email \
        --non-interactive \
        --keep-until-expiring
}

write_nginx_https_production() {
    log_info "Writing hardened HTTPS Nginx config for ${TARGET_LABEL}..."

    cat > "/etc/nginx/sites-available/${NGINX_SITE_NAME}" <<EOF
limit_req_zone \$binary_remote_addr zone=${NGINX_SITE_NAME}_api_limit:10m rate=20r/s;

server {
        listen 80;
        listen [::]:80;
        server_name ${DOMAIN};

        location /.well-known/acme-challenge/ {
                root /var/www/certbot;
        }

        location / {
                return 301 https://\$host\$request_uri;
        }
}

server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name ${DOMAIN};
        server_tokens off;

        ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        client_max_body_size 20M;

        location /api/ {
                limit_req zone=${NGINX_SITE_NAME}_api_limit burst=40 nodelay;
                proxy_pass http://${APP_HOST}:${DEFAULT_PORT};
                proxy_http_version 1.1;
                proxy_set_header Upgrade \$http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host \$host;
                proxy_set_header X-Real-IP \$remote_addr;
                proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto https;
        }

        location / {
                proxy_pass http://${APP_HOST}:${DEFAULT_PORT};
                proxy_http_version 1.1;
                proxy_set_header Upgrade \$http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host \$host;
                proxy_set_header X-Real-IP \$remote_addr;
                proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto https;
        }
}
EOF

    nginx -t
    systemctl reload nginx
}

setup_certbot_auto_renew() {
    log_info "Configuring certificate auto-renew hooks..."
    mkdir -p /etc/letsencrypt/renewal-hooks/deploy
    cat > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
systemctl reload nginx
EOF
    chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh

    systemctl enable certbot.timer
    systemctl restart certbot.timer
    certbot renew --dry-run
}

setup_logrotate() {
    log_info "Configuring log rotation for ${TARGET_LABEL}..."
    cat > "${LOGROTATE_FILE}" <<EOF
${LOG_DIR}/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 ${DEPLOY_USER} ${DEPLOY_USER}
    sharedscripts
    postrotate
        su - ${DEPLOY_USER} -c 'pm2 reloadLogs' || true
    endscript
}
EOF
}

show_summary() {
    log_info "=========================================="
    log_info "VPS bootstrap completed for ${TARGET_LABEL}"
    log_info "=========================================="
    echo "Domain: ${DOMAIN}"
    echo "Server IP (expected): ${SERVER_IP}"
    echo "App dir: ${APP_DIR}"
    echo "Env file: ${ENV_FILE}"
    echo "PM2 app: ${PM2_APP_NAME}"
    echo "Branch: ${DEPLOY_BRANCH}"
    echo ""
    echo "Next steps:"
    echo "1) As ${DEPLOY_USER}, clone project into ${APP_DIR}"
    echo "2) Run deployment: sudo -u ${DEPLOY_USER} DEPLOY_BRANCH=${DEPLOY_BRANCH} bash ${APP_DIR}/scripts/deploy.sh ${TARGET_ENV}"
    echo "3) Enable PM2 startup once app is running:"
    echo "   sudo -u ${DEPLOY_USER} pm2 save"
    echo "   sudo env PATH=\$PATH:/usr/bin pm2 startup systemd -u ${DEPLOY_USER} --hp /home/${DEPLOY_USER}"
}

setup_target() {
    local target="$1"

    load_target_config "$target"
    check_dns
    setup_directories
    setup_postgres
    write_env_file
    write_nginx_http_bootstrap
    issue_ssl_certificate
    ensure_tls_params
    write_nginx_https_production
    setup_logrotate
    show_summary
}

main() {
    require_root
    BOOTSTRAP_TARGET="$(normalize_target "$TARGET")"

    if [ "$BOOTSTRAP_TARGET" = "all" ]; then
        SSH_PORT="${SSH_PORT:-22}"
    else
        load_target_config "$BOOTSTRAP_TARGET"
    fi

    install_base_packages
    install_node_pm2
    setup_deploy_user
    setup_firewall_and_services
    setup_certbot_auto_renew

    case "$BOOTSTRAP_TARGET" in
        all)
            setup_target prod
            setup_target dev
            ;;
        prod|dev)
            setup_target "$TARGET"
            ;;
    esac
}

main "$@"
