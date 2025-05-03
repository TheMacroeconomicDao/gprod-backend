#!/bin/sh
set -e

# Production-ready: автоматические миграции и генерация Prisma Client

# Ждём, пока база будет доступна (до 30 сек)
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER"; do
  echo "Waiting for postgres..."
  sleep 2
done

echo "Running Prisma migrations..."
pnpm prisma migrate deploy

echo "Generating Prisma client..."
pnpm prisma generate

echo "Starting app..."
exec node dist/src/main.js 