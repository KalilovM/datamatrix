#!/bin/sh

echo "Running Prisma generate..."
npm run prisma:generate

echo "Applying Prisma migrations..."
npx prisma migrate deploy

echo "Building the Next.js application..."
npm run build

echo "Starting the production server..."
npm run start
