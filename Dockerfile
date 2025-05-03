FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY prisma ./prisma
COPY . .
RUN npx prisma generate
RUN pnpm run build
RUN apk add --no-cache git
RUN apk add --no-cache postgresql-client
# Генерируем build-info.json (gitHash = 'unknown' если git недоступен)
RUN node -e "const { execSync } = require('child_process'); const fs = require('fs'); const pkg = require('./package.json'); let gitHash = 'unknown'; try { gitHash = execSync('git rev-parse --short HEAD').toString().trim(); } catch (e) {} fs.writeFileSync('./build-info.json', JSON.stringify({ name: pkg.name, version: pkg.version, buildTime: new Date().toISOString(), gitHash }, null, 2));"
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh
CMD ["sh", "/app/docker-entrypoint.sh"]