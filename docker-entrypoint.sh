#!/bin/sh
set -e
pnpm prisma migrate deploy
if [ -f prisma/seed.ts ] || [ -f prisma/seed.js ]; then
  pnpm prisma db seed || true
fi
exec node dist/src/main.js 