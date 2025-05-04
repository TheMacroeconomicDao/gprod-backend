# GPROD Backend (Gybernaty Community)

**Production-ready бэкенд на NestJS + Prisma + PostgreSQL + pnpm + Docker**

Профессиональный бэкенд-сервер с тремя контурами окружения (dev, stage, prod), ролевым доступом, JWT-аутентификацией, автоматическими миграциями, документацией API и мониторингом.

---

## TL;DR: Быстрый старт проекта
- **Клонирование репозитория:**
  ```sh
  git clone https://github.com/TheMacroeconomicDao/gprod-backend.git
  cd gprod-backend
  pnpm install
  ```

- **Новая система окружений:**
  ```sh
  # Установка шаблонов .env файлов для всех контуров
  pnpm run env:setup

  # Выбор контура для локальной разработки
  pnpm run env:switch dev
  ```

- **Запуск базового окружения для разработки:**
  ```sh
  # Запуск минимального docker-compose для разработки
  pnpm run docker:reference
  ```

## Инфраструктура

Инфраструктурные конфигурации (Docker, Nginx, мониторинг) вынесены в отдельный репозиторий: [gybernaty-infra](https://github.com/TheMacroeconomicDao/gybernaty-infra)

### Разделенная архитектура

Начиная с версии 2.0, проект использует разделенную архитектуру со следующими репозиториями:

- **[gprod-backend](https://github.com/TheMacroeconomicDao/gprod-backend)** - код приложения, API, бизнес-логика
- **[gybernaty-infra](https://github.com/TheMacroeconomicDao/gybernaty-infra)** - инфраструктурные конфигурации

Такое разделение обеспечивает:
- Чистоту кодовой базы приложения
- Независимое развитие инфраструктуры
- Соответствие принципам DevOps
- Возможность иметь разные команды для разработки и инфраструктуры

### Варианты запуска

**Минимальный запуск** (только для разработки):
```sh
# Использование упрощенной конфигурации из основного репозитория
pnpm run docker:reference
```

**Полный запуск** с использованием инфраструктурного репозитория:
```sh
# 1. Клонируем оба репозитория
git clone https://github.com/TheMacroeconomicDao/gprod-backend.git
git clone https://github.com/TheMacroeconomicDao/gybernaty-infra.git

# 2. Запускаем инфраструктуру для нужного контура
cd gybernaty-infra
docker-compose -f docker/docker-compose.yml -f docker/prod/docker-compose.prod.yml up -d
```

## Документация

Полная документация проекта доступна в директории [docs/](docs/):

- [Общий обзор документации](docs/README.md) - структура и навигация по документации
- [Архитектура](docs/architecture/README.md) - описание архитектуры приложения и принципов организации кода
- [API](docs/api/README.md) - документация по API, эндпоинтам и форматам данных
- [Окружения](docs/environments/README.md) - информация о контурах окружения и настройке
- [Docker](docs/docker/README.md) - инструкции по работе с Docker и конфигурации
- [Автоматизация](docs/automation/README.md) - скрипты и инструменты для автоматизации процессов
- [Разработка](docs/development/README.md) - руководство для разработчиков
- [Тестирование](docs/testing/README.md) - информация о тестировании и CI/CD
- [Безопасность](docs/security/README.md) - рекомендации по безопасности
- [Разделенная инфраструктура](docs/split-infrastructure.md) - документация по работе с разделенной инфраструктурой

## Основные команды

### Запуск приложения

```sh
# Запуск минимальной конфигурации (рекомендуется для разработки)
pnpm run docker:reference          # запуск
pnpm run docker:reference:down     # остановка
pnpm run docker:reference:restart  # перезапуск
pnpm run docker:reference:logs     # просмотр логов
pnpm run docker:reference:build    # пересборка

# Запуск в Docker с автоматическими миграциями
pnpm run docker:restart
```

### Тестирование

```sh
# Все тесты с пересборкой
pnpm run docker:test:rebuild

# Только e2e тесты
pnpm run docker:test:e2e

# Только unit тесты
pnpm run docker:test
```

### Управление окружениями

```sh
# Создать шаблоны .env файлов
pnpm run env:setup

# Интерактивный выбор окружения
pnpm run env:switch:new

# Активация конкретного окружения
pnpm run env:dev:new        # development
pnpm run env:stage:new      # staging
pnpm run env:prod:new       # production
```

## Доступ к сервисам

### API и документация
- **API v1**: http://localhost:3000/api/v1 (порт зависит от контура)
- **Swagger v1**: http://localhost:3000/api/v1/docs
- **Swagger v2**: http://localhost:3000/api/v2/docs

### Дополнительные сервисы
- **Adminer** (dev): http://localhost:8080 - управление БД
- **Prometheus** (stage): http://localhost:9090 - метрики
- **Grafana** (stage): http://localhost:3100 - мониторинг
- **Grafana** (prod): http://localhost:3500 - мониторинг

## Основные эндпоинты

### Auth
- **POST /api/v1/auth/register** — регистрация
- **POST /api/v1/auth/login** — логин (JWT)
- **POST /api/v1/auth/refresh** — обновление токена

### Users
- **GET /api/v1/users** — список пользователей
- **GET /api/v1/users/:id** — пользователь по id
- **POST /api/v1/users** — создать пользователя
- **PATCH /api/v1/users/:id** — обновить пользователя
- **DELETE /api/v1/users/:id** — удалить пользователя

### Projects
- **GET /api/v1/projects** — список проектов (JWT)
- **GET /api/v1/projects/:id** — проект по id (JWT)
- **POST /api/v1/projects** — создать проект (JWT)
- **PATCH /api/v1/projects/:id** — обновить проект (JWT)
- **DELETE /api/v1/projects/:id** — удалить проект (JWT, роль: admin)

### Health
- **GET /api/v1/health** — статус приложения и БД

## Технологический стек

- **NestJS** — модульный бэкенд-фреймворк с DI-контейнером
- **TypeScript** — строгая типизация
- **Prisma ORM** — типобезопасный ORM с миграциями
- **PostgreSQL** — надёжная СУБД
- **Docker & docker-compose** — контейнеризация
- **Swagger** — автоматическая документация API
- **JWT** — безопасная аутентификация
- **Winston** — структурированное логирование
- **Jest** — тестирование
- **Class-validator** — валидация входящих данных
- **Argon2** — современное хеширование паролей
- **Prometheus & Grafana** — мониторинг

## Контуры окружения

### Development (dev)
- **Порт**: 3000
- **База данных**: PostgreSQL на порту 5432
- **Особенности**: Hot Reload, автоматические миграции, Adminer

### Staging (stage)
- **Порт**: 3003
- **База данных**: PostgreSQL на порту 5433
- **Особенности**: Prometheus, Grafana, оптимизированная конфигурация

### Production (prod)
- **Порт**: 3007
- **База данных**: PostgreSQL с выделенным volume
- **Особенности**: Nginx с SSL, Grafana, высокая отказоустойчивость

## Частые вопросы (FAQ)

- **Почему нет подключения к БД в stage/prod?** — Проверьте порты и DATABASE_URL в .env файле. Для stage порт БД 5433.
- **Как сменить порт?** — Измените PORT в соответствующем .env файле.
- **Как добавить новые переменные?** — Добавьте в .env файлы контуров и используйте через EnvHelper.
- **Как исправить ошибку "roles column missing"?** — Примените миграцию: pnpm run prisma:migrate:dev

## Лицензия
AGPL-v3 (см. LICENSE)

---

**GPROD by Gybernaty** — чистый, production-ready бэкенд. Вопросы/PR — welcome. 