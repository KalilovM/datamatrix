#!/bin/sh

echo "Running Prisma generate..."
npm run prisma:generate

echo "Deploying Prisma migrations..."
npm run prisma:deploy

echo "Seeding the database..."
npm run prisma:seed

echo "Building the Next.js application..."
npm run build

echo "Starting the production server..."
npm run start
