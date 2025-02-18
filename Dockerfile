FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install --frozen-lockfile

# Stage 2: Runtime
FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm install --frozen-lockfile

EXPOSE 3000

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
