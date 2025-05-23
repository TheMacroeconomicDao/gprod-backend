# GPROD Backend (Gybernaty Community)

**Production-ready бэкенд на NestJS + Prisma + PostgreSQL + pnpm + Docker**

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

## ⚡️ Управление переменными окружения (env)

- В проекте нет фиксированного .env — он всегда генерируется или переключается через скрипты в `automation/env/`.
- Основные скрипты:
  - `env-manager.sh`: переключение окружений, создание нужного .env.<env>, симлинк .env, генерация базового файла при отсутствии.
  - `env-switch-new.sh`: продвинутый переключатель, OS detection, адаптация DATABASE_URL, автозапуск docker-compose, создание из шаблонов.
  - `setup-env-files.sh`: массовая генерация шаблонов .env для всех окружений, интерактивный выбор.
- Для любого окружения можно сгенерировать .env через шаблон или создать базовый.
- Симлинк `.env` всегда указывает на актуальный .env.<env>.
- Для CI/CD, Docker, локальной разработки — всегда используйте скрипты из `automation/env/`.
- Если .env не найден — его можно создать командой:
  ```sh
  ./automation/env/env-manager.sh dev
  # или интерактивно
  ./automation/env/env-switch-new.sh
  ```
- Скрипты адаптируют переменные под Docker/локалку (например, DATABASE_URL).
- Для тестов и разработки всегда запускай:
  ```sh
  ./automation/env/env-manager.sh dev --docker
  ```
- Если нужен .env для CI — добавь шаг генерации .env через эти скрипты в pipeline.