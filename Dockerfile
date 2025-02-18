FROM node:16 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all source code into the container
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Production image
FROM node:16-alpine AS production

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./

# Expose the port that the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
