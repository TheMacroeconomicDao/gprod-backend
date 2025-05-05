# Скрипты автоматизации в GPROD Backend

## Интерактивный запуск проекта

### Обзор

Скрипт `interactive-run.sh` предоставляет удобный интерфейс для запуска проекта с выбором контура окружения и режима запуска через меню, что значительно упрощает процесс запуска для разработчиков.

### Запуск

```bash
# Запуск через pnpm
pnpm run auto:interactive

# Или прямой запуск скрипта
./automation/scripts/interactive-run.sh
```

### Интерфейс

При запуске вы увидите интерактивное меню:

```
🚀 GPROD Интерактивный запуск

Выберите контур:
  1) Development (dev) - для локальной разработки
  2) Staging (stage) - для тестирования
  3) Production (prod) - для продакшена
  4) Reference - минимальная конфигурация

Режим запуска:
  a) Обычный запуск
  b) С пересборкой

Дополнительные опции:
  q) Выход

Введите комбинацию (например, 1a для обычного запуска dev): 
```

Примеры команд:
- `1a` - dev в обычном режиме
- `1b` - dev с пересборкой
- `2a` - stage в обычном режиме
- `3b` - prod с пересборкой
- `4a` - reference в обычном режиме

## Скрипт запуска тестов

Скрипт `docker-test-runner.sh` автоматизирует процесс запуска тестов в Docker-окружении.

### Возможности скрипта

- Ожидание готовности базы данных
- Применение миграций перед запуском тестов
- Запуск unit и e2e тестов с правильными настройками
- Обработка ошибок и корректное завершение

### Использование

```bash
# Запуск всех тестов в Docker
pnpm run docker:test:all

# Запуск с чистым окружением
pnpm run docker:test:clean

# Только unit-тесты
pnpm run docker:test:unit

# Только e2e-тесты
pnpm run docker:test:e2e
```

## Управление окружениями

Система автоматизации включает скрипты для управления переменными окружения.

### Основные команды

```bash
# Создать шаблоны .env файлов
pnpm run env:setup

# Интерактивный выбор окружения
pnpm run env:switch:new

# Активация конкретного окружения
pnpm run env:dev:new        # development
pnpm run env:stage:new      # staging
pnpm run env:prod:new       # production
```

## Скрипты для Docker

### Запуск контуров

```bash
# Development
pnpm run docker:dev          # Запустить
pnpm run docker:dev:build    # Запустить с пересборкой
pnpm run docker:dev:stop     # Остановить

# Staging
pnpm run docker:stage        # Запустить
pnpm run docker:stage:build  # Запустить с пересборкой
pnpm run docker:stage:stop   # Остановить

# Production
pnpm run docker:prod         # Запустить
pnpm run docker:prod:build   # Запустить с пересборкой
pnpm run docker:prod:stop    # Остановить

# Reference (минимальная конфигурация)
pnpm run docker:reference    # Запустить
pnpm run docker:reference:build # Запустить с пересборкой
pnpm run docker:reference:down  # Остановить
```

### Управление базой данных

```bash
# Миграции Prisma в Docker
pnpm run docker:prisma:migrate:dev    # Миграция для development
pnpm run docker:prisma:migrate:stage  # Миграция для staging
pnpm run docker:prisma:migrate:prod   # Миграция для production

# Prisma Studio
pnpm run docker:prisma:studio:dev     # Запуск Prisma Studio
```

## Другие полезные скрипты

### Управление через docker-manager.sh

```bash
# Синтаксис
./docker/docker-manager.sh <контур> <команда> [--build]

# Примеры
./docker/docker-manager.sh dev up          # Запустить development
./docker/docker-manager.sh stage down      # Остановить staging
./docker/docker-manager.sh prod restart    # Перезапустить production
./docker/docker-manager.sh reference logs  # Показать логи reference
```

### Мониторинг и логи

```bash
# Показать логи
pnpm run auto:logs:dev        # Логи development
pnpm run auto:logs:stage      # Логи staging
pnpm run auto:logs:prod       # Логи production

# Мониторинг (Grafana доступна по соответствующим URL)
pnpm run docker:stage:monitor # Мониторинг staging
pnpm run docker:prod:monitor  # Мониторинг production
```

## Структура скриптов автоматизации

```
automation/
├── scripts/
│   ├── docker-test-runner.sh  # Запуск тестов в Docker
│   ├── interactive-run.sh     # Интерактивный запуск
│   ├── run.sh                 # Основной скрипт для запуска контуров
│   └── env-manager.sh         # Управление окружениями
│
├── templates/
│   ├── .env.development       # Шаблон для development
│   ├── .env.staging           # Шаблон для staging
│   ├── .env.production        # Шаблон для production
│   └── .env.test              # Шаблон для тестов
```
