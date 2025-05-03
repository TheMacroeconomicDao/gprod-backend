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
- **Build info:** GET http://localhost:3007/api/v1 — buildTime, gitHash, version, env

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
  - Build info endpoint

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

### 4. Build info endpoint
- GET http://localhost:3007/api/v1
- Возвращает: name, version, buildTime, gitHash (dev/stage), env
- В production gitHash/version скрыты для безопасности

### 5. Тесты (unit + e2e)
```sh
pnpm run docker:test:rebuild
# или только e2e:
pnpm run docker:test:e2e
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
- Для каждого окружения (dev, stage, prod) свои переменные (см. EnvHelper)

---

## Миграции и seed
- Миграции: `pnpm run prisma:migrate:dev`
- Генерация Prisma: `pnpm run prisma:generate:dev`
- Seed-скрипты: см. prisma/seed.ts (если есть)
- **В Docker миграции и сиды применяются автоматически** (см. docker-entrypoint.sh)

---

## Build info endpoint
- GET `/api/v1` — возвращает buildTime, gitHash, version, env
- gitHash может быть 'unknown', если .git не скопирован в образ (production best practice)
- В production gitHash/version скрыты

---

## Production best practices
- Все переменные через .env, никакого хардкода
- JWT, rate-limit, RBAC, health-check, Winston — всё включено
- Swagger с примерами, описаниями, security
- Docker/Docker Compose для любого окружения
- Миграции и генерация Prisma — npm-скриптами
- Build info endpoint для traceability
- Легко расширять (RBAC, monitoring, e2e, CI/CD)

---

## Основные эндпоинты

### Auth
- **POST /api/v1/auth/register** — регистрация
- **POST /api/v1/auth/login** — логин (JWT, через Guard)
- **POST /api/v1/auth/refresh** — refresh токен

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
curl -X POST http://localhost:3007/api/v1/auth/register -H 'Content-Type: application/json' -d '{"username":"vasya","email":"vasya@mail.com","password":"qwerty"}'

# Логин
curl -X POST http://localhost:3007/api/v1/auth/login -H 'Content-Type: application/json' -d '{"username":"vasya","password":"qwerty"}'

# Получить пользователей
curl http://localhost:3007/api/v1/users

# Получить проекты (JWT)
curl http://localhost:3007/api/v1/projects -H 'Authorization: Bearer <token>'

# Health-check
curl http://localhost:3007/api/v1/health
```

---

## Тесты
```sh
pnpm run test         # unit
pnpm run test:cov     # покрытие
```
- Покрытие: сервисы и контроллеры users, projects, auth
- Моки Prisma, нет зависимости от базы

---

## Автоматические миграции и сиды в Docker
- В контейнере app перед стартом автоматически применяются миграции и сиды (см. docker-entrypoint.sh)
- Это гарантирует, что БД всегда актуальна и тесты проходят с нуля

---

## Postman collection
- Файл: postman_collection.json
- Покрывает все основные сценарии (auth, users, projects, health)

---

## Частые вопросы (FAQ)
- **Почему gitHash может быть unknown?** — Если .git не скопирован в Docker-образ (production best practice)
- **Как сменить порт?** — Измени PORT/DEV_PORT/PRODUCTION_PORT в .env
- **Как добавить новые переменные?** — Добавь в .env и используй через EnvHelper
- **Почему в production не видно gitHash/version?** — Для безопасности, чтобы не светить инфу наружу

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
MIT (см. LICENSE)

---

**GPROD by Gybernaty** — чистый, production-ready backend. Вопросы/PR — welcome.
