#!/usr/bin/env bash

set -euo pipefail

normalize_target() {
    local raw_target="${1:-prod}"

    case "$raw_target" in
        prod|production|main)
            echo "prod"
            ;;
        dev|development|test|staging)
            echo "dev"
            ;;
        all)
            echo "all"
            ;;
        *)
            echo "Unsupported deployment target: ${raw_target}" >&2
            return 1
            ;;
    esac
}

load_target_config() {
    local requested_target="${1:-${DEPLOY_TARGET:-prod}}"
    local target

    target="$(normalize_target "$requested_target")"
    if [ "$target" = "all" ]; then
        echo "Target 'all' must be handled by the caller." >&2
        return 1
    fi

    export TARGET_ENV="$target"
    export DEPLOY_USER="${DEPLOY_USER:-marlen}"
    export REPO_URL="${REPO_URL:-https://github.com/KalilovM/datamatrix.git}"
    export SSL_EMAIL="${SSL_EMAIL:-admin@alonamoda.com}"
    export SSH_PORT="${SSH_PORT:-45633}"
    export APP_HOST="${APP_HOST:-127.0.0.1}"

    case "$target" in
        prod)
            export TARGET_LABEL="production"
            export DOMAIN="dm.alonamoda.com"
            export SERVER_IP="${SERVER_IP:-193.124.33.151}"
            export DEFAULT_PORT="${DEFAULT_PORT:-3000}"
            export APP_DIR="/var/www/datamatrix"
            export ENV_DIR="/etc/datamatrix"
            export ENV_FILE="/etc/datamatrix/.env"
            export BACKUP_DIR="/var/www/datamatrix-backups"
            export LOG_DIR="/var/log/datamatrix"
            export LOGROTATE_FILE="/etc/logrotate.d/datamatrix"
            export DB_NAME="datamatrix_prod"
            export DB_USER="datamatrix_user"
            export PM2_APP_NAME="datamatrix"
            export NGINX_SITE_NAME="datamatrix"
            export DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
            ;;
        dev)
            export TARGET_LABEL="development"
            export DOMAIN="dm.smartlogistics.com"
            export SERVER_IP="${SERVER_IP:-217.29.22.10}"
            export DEFAULT_PORT="${DEFAULT_PORT:-3001}"
            export APP_DIR="/var/www/datamatrix-dev"
            export ENV_DIR="/etc/datamatrix"
            export ENV_FILE="/etc/datamatrix/dev.env"
            export BACKUP_DIR="/var/www/datamatrix-dev-backups"
            export LOG_DIR="/var/log/datamatrix-dev"
            export LOGROTATE_FILE="/etc/logrotate.d/datamatrix-dev"
            export DB_NAME="datamatrix_dev"
            export DB_USER="datamatrix_dev_user"
            export PM2_APP_NAME="datamatrix-dev"
            export NGINX_SITE_NAME="datamatrix-dev"
            export DEPLOY_BRANCH="${DEPLOY_BRANCH:-dev}"
            ;;
    esac

    export NEXTAUTH_URL="https://${DOMAIN}"
    export NEXT_API_URL="https://${DOMAIN}"
    export NEXT_PUBLIC_API_URL="https://${DOMAIN}"
    export APP_DOMAIN="${DOMAIN}"
}
