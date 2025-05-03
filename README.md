# GPROD Backend (Gybernaty Community)

**Production-ready бэкенд на NestJS + Prisma + PostgreSQL + pnpm + Docker**

---

## TL;DR
- **Новая система окружений:**
  ```sh
  # Установка шаблонов .env файлов для всех контуров
  pnpm run env:setup
  
  # Переключение между контурами (dev, stage, prod)
  pnpm run env:switch:new dev   # разработка (порт 3000)
  pnpm run env:switch:new stage # тестирование (порт 3003)
  pnpm run env:switch:new prod  # продакшен (порт 3007)
  ```

- **Запуск в Docker (с автоматическими миграциями):**
  ```sh
  pnpm run docker:restart
  ```
- **Запуск тестов:**
  ```sh
  pnpm run docker:test:rebuild
  ```
- **Swagger:** 
  - v1: http://localhost:3007/api/v1/docs 
  - v2: http://localhost:3007/api/v2/docs
- **Build info:** GET http://localhost:3007/api/v1

---

## Архитектура приложения

Проект построен на современном стеке технологий и лучших практиках разработки:

- **NestJS** — модульный бэкенд-фреймворк с отличной документацией
- **TypeScript** — строгая типизация для безопасного рефакторинга
- **Prisma ORM** — удобная работа с базой данных и миграциями
- **PostgreSQL** — надёжная и производительная СУБД
- **Docker & docker-compose** — контейнеризация и оркестрация
- **Swagger** — автоматическая документация API
- **JWT** — безопасная аутентификация и авторизация
- **Winston** — структурированное логирование
- **Jest** — модульное и e2e тестирование

Система организована в модульную структуру:
- **AUTH** — аутентификация и авторизация
- **USERS** — управление пользователями
- **PROJECTS** — управление проектами
- **HEALTH** — проверка состояния приложения

---

## Контуры окружения и новая работа с .env файлами

Проект поддерживает три контура окружения с независимыми настройками:

1. **Development (dev)** — для локальной разработки
   - Порт: 3000
   - Доп. сервисы: Adminer
   
2. **Staging (stage)** — для тестирования перед релизом
   - Порт: 3003
   - Доп. сервисы: Prometheus, Grafana
   
3. **Production (prod)** — для боевого окружения
   - Порт: 3007
   - Доп. сервисы: Nginx (SSL), Grafana, Redis

### Новая система управления переменными окружения:

```sh
# Создать шаблоны .env файлов для всех окружений
pnpm run env:setup

# Переключение между окружениями
pnpm run env:dev:new    # активировать development
pnpm run env:stage:new  # активировать staging
pnpm run env:prod:new   # активировать production
```

Каждый контур использует свой .env файл:
- `.env.development` — для dev
- `.env.staging` — для stage
- `.env.production` — для prod

**Обратная совместимость:** EnvHelper поддерживает как новый подход, так и старый с префиксами (DEV_, STAGE_, PRODUCTION_).

---

## Миграции и работа с базой данных

### Автоматизация миграций

- **В dev-режиме** (NODE_ENV=development):
  - Все изменения schema.prisma автоматически попадают в базу при старте контейнера
  - Миграции создаются и применяются автоматически
  - Сиды применяются автоматически

- **В prod/stage режимах**:
  - Применяются только существующие миграции (`prisma migrate deploy`)
  - Если миграции не применились — контейнер не стартует
  
- **Fail-fast политика:**
  - Приложение не стартует при несоответствии схемы БД и schema.prisma
  - Показывает понятную ошибку (например, "FATAL: roles column missing in User table")

### Скрипты для работы с Prisma

```sh
# Разработка и миграции
pnpm run prisma:migrate:dev    # миграции для development
pnpm run prisma:migrate:stage  # миграции для staging
pnpm run prisma:migrate:prod   # миграции для production

# Prisma Studio (просмотр/редактирование БД через GUI)
pnpm run prisma:studio:dev     # для development
pnpm run prisma:studio:stage   # для staging
pnpm run prisma:studio:prod    # для production
```

---

## Безопасность

Проект включает множество механизмов защиты:

- **JWT-аутентификация** с refresh токенами 
- **Argon2** — современный алгоритм хеширования паролей
- **Roles Guard** — защита эндпоинтов по ролям
- **Rate Limiting** — защита от брутфорс-атак
- **Helmet** — настройка безопасных HTTP заголовков
- **CORS** — настройка доступа с разных доменов
- **Валидация** через DTO с декораторами (class-validator)
- **Request size limiting** — защита от DoS атак

---

## Быстрый старт и тестирование

### 1. Клонируй репозиторий и настрой окружение
```sh
# Установка шаблонов .env файлов
pnpm run env:setup

# Выбор контура окружения (dev, stage или prod)
pnpm run env:dev:new
```

### 2. Запусти всё в Docker
```sh
pnpm run docker:restart
```

### 3. Swagger UI
- v1: http://localhost:3000/api/v1/docs (порт зависит от контура)
- v2: http://localhost:3000/api/v2/docs

### 4. Тесты (unit + e2e)
```sh
pnpm run docker:test:rebuild
# или только e2e:
pnpm run docker:test:e2e
```

---

## Основные эндпоинты

### Auth
- **POST /api/v1/auth/register** — регистрация
- **POST /api/v1/auth/login** — логин (JWT)
- **POST /api/v1/auth/refresh** — обновление токена

### Users
- **GET /api/v1/users** — список (пагинация, поиск, сортировка)
- **GET /api/v1/users/:id** — по id
- **POST /api/v1/users** — создать
- **PATCH /api/v1/users/:id** — обновить
- **DELETE /api/v1/users/:id** — удалить (soft-delete)

### Projects
- **GET /api/v1/projects** — список (JWT, пагинация, поиск, сортировка)
- **GET /api/v1/projects/:id** — по id (JWT)
- **POST /api/v1/projects** — создать (JWT)
- **PATCH /api/v1/projects/:id** — обновить (JWT)
- **DELETE /api/v1/projects/:id** — удалить (JWT, роль: admin)

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

## Тестирование

```sh
# Unit-тесты
pnpm run test
pnpm run test:cov     # с покрытием

# E2E-тесты
pnpm run test:e2e:local   # локально
pnpm run test:e2e:docker  # в Docker
```

- Покрытие: сервисы и контроллеры users, projects, auth
- Моки Prisma, нет зависимости от базы

---

## Мониторинг и логирование

- **Prometheus** — сбор метрик (доступен в stage/prod)
- **Grafana** — визуализация метрик и дашборды
- **Winston Logger** — структурированное логирование

Доступ:
- Prometheus: http://localhost:9090 (только stage)
- Grafana: http://localhost:3100 (stage) или http://localhost:3500 (prod)

---

## Скрипты (package.json)

### Docker и окружения
```sh
# Запуск Docker
pnpm run docker:dev           # development
pnpm run docker:dev:build     # пересборка development
pnpm run docker:stage         # staging
pnpm run docker:stage:build   # пересборка staging
pnpm run docker:prod          # production
pnpm run docker:prod:build    # пересборка production

# Окружения (новый подход)
pnpm run env:setup            # создать шаблоны .env файлов
pnpm run env:switch:new       # интерактивный выбор окружения
pnpm run env:dev:new          # активировать development
pnpm run env:stage:new        # активировать staging
pnpm run env:prod:new         # активировать production

# Тесты
pnpm run docker:test          # unit тесты в Docker
pnpm run docker:test:e2e      # e2e тесты в Docker
```

---

## Частые вопросы (FAQ)

- **Почему нет подключения к БД в stage/prod?** — Проверь порты и DATABASE_URL в .env файле. Для stage порт БД 5433 вместо 5432.
- **Почему gitHash может быть unknown?** — Если .git не скопирован в Docker-образ (production best practice).
- **Как сменить порт?** — Измени PORT в соответствующем .env файле.
- **Как добавить новые переменные?** — Добавь в .env файлы контуров и используй через EnvHelper.
- **Как исправить ошибку "roles column missing"?** — Примени миграцию: pnpm run prisma:migrate:dev (или другую для нужного контура).

---

## Рекомендации по развитию проекта

### Архитектурные улучшения
1. **Реализация CQRS** для более сложных бизнес-кейсов
2. **Микросервисная архитектура** для масштабирования
3. **Event-driven подход** для асинхронной обработки событий

### Технические улучшения
1. **Кэширование через Redis** для повышения производительности
2. **CI/CD пайплайн** для автоматизации деплоя
3. **Более детальный мониторинг** с custom метриками

### Функциональные улучшения
1. **Гибкая система ролей и разрешений**
2. **OAuth интеграция** для авторизации через соцсети
3. **Многоязычность** (i18n) для интернационализации

---

## Вклад в проект (contributing)
- Пиши тесты к фичам и багфиксам
- Соблюдай архитектуру (модули, DI, DTO, Guards)
- Не коммить .env файлы, node_modules, логи, временные файлы
- Перед PR: `pnpm run lint && pnpm run test`

---

## Полезные ссылки
- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [pnpm Docs](https://pnpm.io/)
- [Docker Docs](https://docs.docker.com/)
- [JWT.io](https://jwt.io/)

---

## Лицензия
MIT (см. LICENSE)

---

**GPROD by Gybernaty** — чистый, production-ready бэкенд. Вопросы/PR — welcome.
