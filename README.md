# GPROD Backend (Gybernaty Community)

Production-ready бэкенд на NestJS + Prisma + PostgreSQL + pnpm + Docker

## Статус проекта

![Версия](https://img.shields.io/badge/версия-1.0.0-blue)
![Статус](https://img.shields.io/badge/статус-активная_разработка-green)
![Тесты](https://img.shields.io/badge/тесты-проходят-success)

| Компонент | Статус | Прогресс |
|-----------|--------|----------|
| API v1 | ✅ Релиз | 100% |
| Аутентификация | ✅ Релиз | 100% |
| Авторизация | ✅ Релиз | 100% |
| Управление пользователями | ✅ Релиз | 100% |
| Управление проектами | ✅ Релиз | 100% |
| API v2 | ⏳ В разработке | 40% |
| Расширенная безопасность | 📅 Запланировано | 0% |

## Быстрый старт

```bash
# Клонирование репозитория
git clone https://github.com/TheMacroeconomicDao/gprod-backend.git
cd gprod-backend
pnpm install

# Настройка окружения
pnpm run env:setup
pnpm run env:switch dev

# Запуск в Docker
pnpm run auto:interactive
```

## Основные фичи

- ✅ **Три контура окружения** - dev, stage, prod
- ✅ **Ролевой доступ** - RBAC с детальными правами
- ✅ **JWT-аутентификация** - безопасная и масштабируемая
- ✅ **Автоматические миграции** - управление схемой БД
- ✅ **Документация API** - Swagger для всех эндпоинтов
- ✅ **Мониторинг** - Grafana + Prometheus

## Инфраструктура

Проект использует разделенную архитектуру:

- **[gprod-backend](https://github.com/TheMacroeconomicDao/gprod-backend)** - код приложения, API, бизнес-логика
- **[gybernaty-infra](https://github.com/TheMacroeconomicDao/gybernaty-infra)** - инфраструктурные конфигурации

## Основные команды

### Запуск приложения
```bash
# Интерактивный запуск
pnpm run auto:interactive

# Разработка
pnpm run auto:run:dev
pnpm run docker:reference

# Продакшн
pnpm run auto:run:prod
```

### Тестирование
```bash
# Запуск всех тестов в Docker
pnpm run docker:test:all

# Запуск с чистым окружением
pnpm run docker:test:clean
```

## Документация

Полная документация проекта доступна в директории [docs/](docs/README.md)

### 📊 Статус и планирование
- [🗺️ Дорожная карта](docs/ROADMAP.md) - План развития проекта
- [📈 Текущий статус](docs/STATUS.md) - Состояние разработки 
- [📝 История изменений](docs/CHANGELOG.md) - Журнал версий

### 🏗️ Архитектура и дизайн
- [🏛️ Обзор архитектуры](docs/architecture/README.md) - Высокоуровневая архитектура
- [🧩 Модули](docs/architecture/modules.md) - Модульная структура

### 👨‍💻 Процессы
- [📋 Разработка](docs/development/README.md) - Процесс разработки
- [🧪 Тестирование](docs/testing/README.md) - Стратегия тестирования
- [🐳 Docker](docs/docker/README.md) - Docker-конфигурации

## Контрибьютинг

Подробная информация о том, как внести вклад в проект, доступна в [руководстве по контрибьютингу](docs/development/contributing.md).

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
- **Prometheus & Grafana** — мониторинг

## Лицензия

AGPL-3.0