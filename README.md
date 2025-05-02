# GPROD Backend (Gybernaty Community)

**Production-ready backend на NestJS + Prisma + PostgreSQL + pnpm + Docker**

---

## TL;DR
- **Запуск в Docker:**
  ```sh
  pnpm run docker:restart
  ```
- **Swagger:** http://localhost:3007/api/v1/docs (и v2/docs)
- **Тесты:**
  ```sh
  pnpm run docker:test:rebuild
  ```

---

## Архитектура
- **NestJS** (TypeScript, модульная структура, DI, Guards, Filters, DTO)
- **Prisma** (PostgreSQL, миграции, seed)
- **pnpm** (быстрый и надёжный пакетный менеджер)
- **Docker/Docker Compose** (прод/дев окружение)
- **Swagger** (OpenAPI, автогенерация для v1/v2)
- **Тесты:** unit, e2e (Jest, Supertest)
- **Best practices:**
  - Безопасность (helmet, CORS, DTO валидация, hash паролей)
  - Глобальный фильтр ошибок, логирование (winston)
  - Версионирование API (v1, v2)

---

## Быстрый старт

### 1. Клонируй репозиторий и настрой .env
```sh
cp env.visible .env
# Проверь переменные (DB, JWT, PORT)
```

### 2. Запусти всё в Docker
```sh
pnpm run docker:restart
```

### 3. Swagger UI
- v1: http://localhost:3007/api/v1/docs
- v2: http://localhost:3007/api/v2/docs

### 4. Тесты (unit + e2e)
```sh
pnpm run docker:test:rebuild
```

---

## Скрипты (package.json)
- `pnpm run docker:restart` — пересобрать и запустить всё в Docker
- `pnpm run docker:test` — тесты в Docker
- `pnpm run docker:test:e2e` — e2e-тесты в Docker
- `pnpm run docker:test:rebuild` — пересобрать и сразу запустить тесты в Docker
- `pnpm run test` — unit-тесты локально
- `pnpm run test:e2e` — e2e-тесты локально
- `pnpm run lint` — линтинг
- `pnpm run build` — сборка
- `pnpm run prisma:migrate:dev` — миграции (dev)
- `pnpm run prisma:generate:dev` — генерация Prisma (dev)

---

## Переменные окружения
- Пример: см. `env.visible`
- Важно: не коммить .env и реальные секреты!

---

## Миграции и seed
- Миграции: `pnpm run prisma:migrate:dev`
- Генерация Prisma: `pnpm run prisma:generate:dev`
- Seed-скрипты: см. prisma/seed.ts (если есть)

---

## Вклад в проект (contributing)
- Пиши тесты к фичам и багфиксам
- Соблюдай архитектуру (модули, DI, DTO, Guards)
- Не коммить .env, node_modules, .cursor, логи, временные файлы
- Перед PR: `pnpm run lint && pnpm run test`

---

## Полезные ссылки
- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [pnpm Docs](https://pnpm.io/)
- [Docker Docs](https://docs.docker.com/)

---

## Лицензия
AGPL-v3 (см. LICENSE)
