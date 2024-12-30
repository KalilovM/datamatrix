# Stage 1: Install dependencies
FROM node:18-alpine AS deps

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install --frozen-lockfile

# Stage 2: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy the source code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 3: Runtime
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

# Install production dependencies
RUN npm install --production --frozen-lockfile

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
