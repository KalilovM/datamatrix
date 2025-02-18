FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install --frozen-lockfile

# Stage 2: Runtime
FROM node:18-alpine AS runner
WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy the entire source code into the image
COPY . .

# (Optionally, install production-only dependencies if needed)
RUN npm install --production --frozen-lockfile

# Expose the application port
EXPOSE 3000

# Copy the docker-entrypoint script and make it executable
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Run the entrypoint script on container start
ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
