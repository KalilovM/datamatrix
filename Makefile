# =============================================================================
# DataMatrix Makefile
# =============================================================================
# Common development and deployment commands
# Usage: make <target>
# =============================================================================

.PHONY: help dev build start lint test clean install db-migrate db-push db-studio db-reset deploy

# Default target
help:
	@echo "DataMatrix Development Commands"
	@echo "================================"
	@echo ""
	@echo "Development:"
	@echo "  make install     - Install dependencies"
	@echo "  make dev         - Start development server"
	@echo "  make build       - Build for production"
	@echo "  make start       - Start production server locally"
	@echo "  make lint        - Run linter"
	@echo "  make test        - Run tests"
	@echo "  make clean       - Clean build artifacts"
	@echo ""
	@echo "Database:"
	@echo "  make db-migrate  - Run Prisma migrations (dev)"
	@echo "  make db-push     - Push schema changes to DB"
	@echo "  make db-studio   - Open Prisma Studio"
	@echo "  make db-reset    - Reset database (WARNING: destroys data)"
	@echo "  make db-seed     - Seed the database"
	@echo ""
	@echo "Production:"
	@echo "  make deploy      - Deploy to production VPS"
	@echo "  make pm2-start   - Start with PM2"
	@echo "  make pm2-restart - Restart PM2 process"
	@echo "  make pm2-logs    - View PM2 logs"
	@echo ""

# =============================================================================
# Development
# =============================================================================

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

lint-fix:
	npm run lint:fix

test:
	npm run test

validate:
	npm run validate

clean:
	rm -rf .next
	rm -rf node_modules/.cache

# =============================================================================
# Database
# =============================================================================

db-migrate:
	npx prisma migrate dev

db-deploy:
	npx prisma migrate deploy

db-push:
	npm run prisma:push

db-studio:
	npm run prisma:studio

db-reset:
	@echo "WARNING: This will destroy all data!"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ]
	npm run prisma:wipe

db-seed:
	npm run prisma:seed

db-generate:
	npm run prisma:generate

# =============================================================================
# Production
# =============================================================================

build-prod:
	NODE_ENV=production npm run build

deploy:
	./scripts/deploy.sh

pm2-start:
	pm2 start ecosystem.config.cjs --env production

pm2-restart:
	pm2 reload datamatrix --update-env

pm2-stop:
	pm2 stop datamatrix

pm2-logs:
	pm2 logs datamatrix

pm2-status:
	pm2 status

health-check:
	curl -s http://127.0.0.1:3000/api/health | jq .

# =============================================================================
# Setup (run once)
# =============================================================================

setup-dev:
	@echo "Setting up development environment..."
	cp -n .env.local.example .env.local || true
	npm ci
	npm run prisma:generate
	@echo ""
	@echo "Edit .env.local with your local settings, then run:"
	@echo "  make db-push   # to create tables"
	@echo "  make dev       # to start development"
