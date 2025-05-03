# GPROD Backend (Gybernaty Community)

**Production-ready backend на NestJS + Prisma + PostgreSQL + pnpm + Docker**

---

## TL;DR
- **Запуск в Docker (dev, auto-migrate):**
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

## Миграции и сиды — теперь полностью автоматизированы!
- **В dev-режиме** (NODE_ENV=development):
  - Все изменения schema.prisma автоматически попадают в базу при старте контейнера.
  - Миграции создаются и применяются автоматически.
  - Сиды применяются автоматически.
- **В prod-режиме** (NODE_ENV=production):
  - Применяются только существующие миграции (`prisma migrate deploy`).
  - Если миграции не применились — контейнер не стартует.
- **Fail-fast:**
  - Если структура базы не соответствует schema.prisma (например, нет нужных колонок), приложение не стартует и пишет явную ошибку.

---

## Быстрый старт и тестирование

### 1. Клонируй репозиторий и настрой .env
```sh
cp env.visible .env
# Проверь переменные (DB, JWT, PORT)
```

### 2. Запусти всё в Docker (dev, auto-migrate)
```sh
pnpm run docker:restart
```
- Все миграции и сиды применятся автоматически!

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
- Все тесты гоняются на свежей базе с актуальной схемой.

---

## Что делать, если что-то не работает
- Проверь логи контейнера: если нет нужных колонок — скорее всего, schema.prisma изменилась, но миграция не была создана (prod) или база не пересоздалась (dev).
- В dev: просто пересоздай контейнеры с помощью `pnpm run docker:restart` — база и миграции будут актуальны.
- В prod: создай миграцию вручную и задеплой её (`pnpm prisma migrate deploy`).

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
