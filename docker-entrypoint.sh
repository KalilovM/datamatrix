#!/bin/sh

echo "Running Prisma generate..."
npm run prisma:generate

echo "Deploying Prisma migrations..."
npx run prisma migrate "init" --create-only

echo "Building the Next.js application..."
npm run build

echo "Starting the production server..."
npm run start
