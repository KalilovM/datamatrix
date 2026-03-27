# DataMatrix

Next.js + Prisma app with VPS deployment scripts for separate development and production environments.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Run `npm ci`.
3. Run `npm run dev`.

## Server environments

- Production: `dm.alonamoda.com`
- Development: `dm.smartlogistics.com`
- Dev VPS: `185.54.253.210:45633`
- Current prod IP: `193.124.33.151`

Both environments use the same deployment script and PM2 ecosystem file, but keep separate runtime resources:

- separate app directories
- separate env files
- separate PostgreSQL databases
- separate PM2 app names
- separate Nginx site configs
- separate log directories
- separate internal ports

Current layout:

- Prod app dir: `/var/www/datamatrix`
- Dev app dir: `/var/www/datamatrix-dev`
- Prod env: `/etc/datamatrix/.env`
- Dev env: `/etc/datamatrix/dev.env`
- Prod port: `3000`
- Dev port: `3001`

This works whether dev and prod live on one host or on separate servers. Your current setup is split-host:

- Prod stays on `dm.alonamoda.com` / `193.124.33.151`
- Dev goes to `dm.smartlogistics.com` / `185.54.253.210`

## VPS bootstrap

Run on each target server as root:

```bash
sudo bash scripts/vps-setup.sh dev
sudo bash scripts/vps-setup.sh prod
```

If you ever colocate both environments on one server, the script also supports:

```bash
sudo bash scripts/vps-setup.sh all
```

What it configures:

- Node.js 20 + PM2
- PostgreSQL
- Nginx reverse proxy for both domains
- Let's Encrypt certificates
- UFW using the configured SSH port for that server
- fail2ban
- logrotate
- per-environment env files with generated secrets

The bootstrap is idempotent and keeps an existing env file instead of regenerating prod credentials.

Important DNS note:

- `dm.alonamoda.com` currently resolves to `193.124.33.151`
- `dm.smartlogistics.com` currently does not resolve yet, so its A record still needs to be pointed at `185.54.253.210`

## Deploying on the VPS

Run as the deploy user on the server:

```bash
bash scripts/deploy.sh dev
bash scripts/deploy.sh prod
```

The script will:

- pull the correct git branch
- install dependencies
- run Prisma migrations
- build the standalone Next.js app
- reload the matching PM2 process
- run a health check on the target port

Branch mapping:

- `dev` branch -> development server
- `main` branch -> production server

## GitHub Actions pipeline

The repo includes `.github/workflows/deploy.yml`, but deployment is now manual-only.

Flow:

1. Open GitHub Actions.
2. Run the `Deploy` workflow manually.
3. Choose `dev` or `prod` as the target environment.

Required GitHub repository secrets:

- `DEV_SSH_HOST` = `185.54.253.210`
- `DEV_SSH_PORT` = `45633`
- `DEV_SSH_USER` = `marlen`
- `DEV_SSH_PASSWORD` = your dev VPS password
- `PROD_SSH_HOST` = your production server host/IP
- `PROD_SSH_PORT` = your production SSH port
- `PROD_SSH_USER` = your production SSH user
- `PROD_SSH_PASSWORD` = your production SSH password

You can also protect the `production` GitHub Environment if you want approvals before prod deploys.

## Important files

- `scripts/lib/deploy-targets.sh`
- `scripts/vps-setup.sh`
- `scripts/deploy.sh`
- `ecosystem.config.cjs`
- `.github/workflows/deploy.yml`
