#!/bin/sh
set -e

# Production-ready: автоматические миграции и генерация Prisma Client

# Ждём, пока база будет доступна (до 30 сек)
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER"; do
  echo "Waiting for postgres..."
  sleep 2
done

if [ "$NODE_ENV" = "development" ]; then
  echo "Running Prisma auto-migrate (dev)..."
  pnpm prisma migrate dev --name auto --skip-seed --create-only || true
  pnpm prisma migrate dev --skip-generate
  pnpm prisma db seed
else
  echo "Running Prisma migrations (prod)..."
  pnpm prisma migrate deploy || { echo "Migrations failed!"; exit 1; }
fi

echo "Generating Prisma client..."
pnpm prisma generate

echo "Starting app..."
exec node dist/src/main.js 