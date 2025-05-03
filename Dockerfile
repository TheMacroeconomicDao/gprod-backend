FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY prisma ./prisma
COPY . .
RUN npx prisma generate
RUN pnpm run build
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh
# Генерируем build-info.json
RUN node -e "const { execSync } = require('child_process'); const fs = require('fs'); const pkg = require('./package.json'); fs.writeFileSync('./build-info.json', JSON.stringify({ name: pkg.name, version: pkg.version, buildTime: new Date().toISOString(), gitHash: execSync('git rev-parse --short HEAD').toString().trim() }, null, 2));"
CMD ["sh", "/app/docker-entrypoint.sh"]