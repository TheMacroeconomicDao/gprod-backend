<<<<<<< HEAD
# GPROD Backend (Gybernaty Community)

**Production-ready backend на NestJS + Prisma + PostgreSQL + pnpm + Docker**
=======
# GPROD by Gybernaty

**Production-ready backend на NestJS + Prisma + PostgreSQL**
>>>>>>> bad720b (Добавлены переменные окружения для разных окружений (dev, stage, prod) в .env, обновлены зависимости в package.json и package-lock.json, добавлены новые функции для работы с refresh токенами, реализована защита от превышения лимита запросов, улучшена обработка ошибок и добавлены роли для пользователей. Обновлены контроллеры и сервисы для поддержки новых функций.)

---

## TL;DR
<<<<<<< HEAD
- **Запуск в Docker:**
  ```sh
  pnpm run docker:restart
  ```
- **Swagger:** http://localhost:3007/api/v1/docs (и v2/docs)
- **Тесты:**
  ```sh
  pnpm run docker:test:rebuild
  ```
=======
- NestJS, Prisma, PostgreSQL, Docker
- Модули: users, auth, projects
- RBAC (роли), JWT, rate-limit, health-check, Winston-логгер
- Глобальный фильтр ошибок, Swagger, тесты, best practices
- Production-ready, легко расширять
>>>>>>> bad720b (Добавлены переменные окружения для разных окружений (dev, stage, prod) в .env, обновлены зависимости в package.json и package-lock.json, добавлены новые функции для работы с refresh токенами, реализована защита от превышения лимита запросов, улучшена обработка ошибок и добавлены роли для пользователей. Обновлены контроллеры и сервисы для поддержки новых функций.)

---

## Архитектура
<<<<<<< HEAD
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
=======
- **NestJS** (TypeScript, DI, Guards, Filters, DTO)
- **Prisma** (PostgreSQL, миграции, schema-first)
- **Docker/Docker Compose** (dev/stage/prod)
- **RBAC** (roles guard, декоратор @Roles)
- **JWT** (auth, refresh, Passport)
- **Rate-limit** (express-rate-limit, 100 req/min)
- **Health-check** (/api/v1/health)
- **Winston** (логгер)
- **Глобальный фильтр ошибок** (единый формат, code)
- **Swagger** (подробно, примеры, security)
- **Тесты** (unit, покрытие сервисов/контроллеров)

---

## Запуск

```sh
git clone ...
cd gprod-new-backend
cp .env.example .env
# dev
npm install
docker-compose up -d db
npm run prisma:migrate:dev
npm run prisma:generate:dev
npm run start:dev
# или через Docker
# docker-compose up --build
```

# Запуск с разными окружениями

## Development
```sh
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## Staging
```sh
docker-compose -f docker-compose.yml -f docker-compose.stage.yml up --build
```

## Production
```sh
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

- Все override-файлы уже созданы.
- Переменные окружения и БД для каждого окружения независимы.
- Для dev-маунты src и .env, для stage/prod — только контейнеры.

---

## .env (пример)
```
DEV_DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_dev
STAGE_DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_stage
PROD_DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_prod
DEV_JWT_SECRET=devsecret
STAGE_JWT_SECRET=stagesecret
PROD_JWT_SECRET=prodsecret
PORT=3000
NODE_ENV=development
```

---

## NPM-скрипты (Prisma, миграции, генерация)
```sh
npm run prisma:migrate:dev      # миграция dev
npm run prisma:migrate:stage    # миграция stage
npm run prisma:migrate:prod     # миграция prod
npm run prisma:generate:dev     # генерация Prisma Client (dev)
npm run prisma:studio:dev       # Prisma Studio (dev)
```

---

## Основные эндпоинты

### Auth
- **POST /api/v1/auth/register** — регистрация
- **POST /api/v1/auth/login** — логин (JWT, через Guard)

### Users
- **GET /api/v1/users** — список (пагинация)
- **GET /api/v1/users/:id** — по id
- **POST /api/v1/users** — создать
- **PATCH /api/v1/users/:id** — обновить
- **DELETE /api/v1/users/:id** — удалить (роль: admin)

### Projects
- **GET /api/v1/projects** — список (JWT)
- **GET /api/v1/projects/:id** — по id (JWT)
- **POST /api/v1/projects** — создать (JWT)
- **PATCH /api/v1/projects/:id** — обновить (JWT)
- **DELETE /api/v1/projects/:id** — удалить (роль: admin)

### Health
- **GET /api/v1/health** — статус приложения и базы

---

## Примеры curl

```sh
# Регистрация
curl -X POST http://localhost:3000/api/v1/auth/register -H 'Content-Type: application/json' -d '{"username":"vasya","email":"vasya@mail.com","password":"qwerty"}'

# Логин
curl -X POST http://localhost:3000/api/v1/auth/login -H 'Content-Type: application/json' -d '{"username":"vasya","password":"qwerty"}'

# Получить пользователей
curl http://localhost:3000/api/v1/users

# Получить проекты (JWT)
curl http://localhost:3000/api/v1/projects -H 'Authorization: Bearer <token>'

# Health-check
curl http://localhost:3000/api/v1/health
```

---

## Тесты
```sh
npm run test         # unit
npm run test:cov     # покрытие
```
- Покрытие: сервисы и контроллеры users, projects, auth
- Моки Prisma, нет зависимости от базы

---

## Production best practices
- Все переменные через .env, никакого хардкода
- JWT, rate-limit, RBAC, health-check, Winston — всё включено
- Swagger с примерами, описаниями, security
- Docker/Docker Compose для любого окружения
- Миграции и генерация Prisma — npm-скриптами
- Легко расширять (RBAC, monitoring, e2e, CI/CD)

---

## Лицензия
GPL

---

**GPROD by Gybernaty** — чистый, production-ready backend. Вопросы/PR — welcome.

---

## Postman collection

Файл: postman_collection.json

- Регистрация
- Логин
- Получить пользователей
- Получить проекты (JWT)
- Health-check
- Примеры с ролями (admin/user)
>>>>>>> bad720b (Добавлены переменные окружения для разных окружений (dev, stage, prod) в .env, обновлены зависимости в package.json и package-lock.json, добавлены новые функции для работы с refresh токенами, реализована защита от превышения лимита запросов, улучшена обработка ошибок и добавлены роли для пользователей. Обновлены контроллеры и сервисы для поддержки новых функций.)
