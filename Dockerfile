FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY prisma ./prisma
COPY . .
RUN npx prisma generate
RUN pnpm run build
CMD ["node", "dist/src/main.js"]