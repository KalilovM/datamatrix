# DataMatrix

Production-ready Next.js + Prisma app with VPS deployment scripts (PM2 + Nginx + Let's Encrypt).

## Local development

1. Copy env file:
	- `.env.local.example` -> `.env.local`
2. Install dependencies:
	- `npm ci`
3. Run app:
	- `npm run dev`

## Production deployment (Ubuntu VPS)

Target domain: `dm.alonamoda.com`  
Target server IP: `193.124.33.151`

### 1) Bootstrap server (run once as root)

- `sudo bash scripts/vps-setup.sh`

This script configures:
- Node.js 20 + PM2
- PostgreSQL
- Nginx reverse proxy
- Let's Encrypt SSL certificate
- Auto-certificate renewal + Nginx reload hook
- UFW + fail2ban + logrotate
- `/etc/datamatrix/.env` with generated secrets

### 2) Deploy app updates (run as deploy user)

- `bash scripts/deploy.sh`

This script:
- pulls latest code from `main`
- installs dependencies
- runs Prisma migrations
- builds Next.js standalone output
- reloads PM2 process
- runs health check

## Important files

- `scripts/vps-setup.sh` - one-time server bootstrap
- `scripts/deploy.sh` - repeatable deployment
- `ecosystem.config.cjs` - PM2 process config
- `.env.prod.example` - production env template
