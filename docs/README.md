# Документация GPROD Backend

## Навигация

### 📊 Статус и планирование
- [🗺️ Дорожная карта](ROADMAP.md) - План развития проекта
- [📈 Текущий статус](STATUS.md) - Состояние разработки 
- [📝 История изменений](CHANGELOG.md) - Журнал версий

### 🏗️ Архитектура и дизайн
- [🏛️ Обзор архитектуры](architecture/README.md) - Высокоуровневая архитектура
- [🧩 Модули](architecture/modules.md) - Модульная структура
- [⚙️ Паттерны](architecture/patterns.md) - Используемые шаблоны проектирования

### 👨‍💻 Процесс разработки
- [🔧 Настройка окружения](development/setup.md) - Инструкция по настройке
- [📋 Рабочий процесс](development/workflow.md) - Процесс разработки
- [✨ Лучшие практики](development/best-practices.md) - Рекомендации

### 🌐 API
- [📡 API v1](api/v1.md) - Документация первой версии API
- [🔄 API v2](api/v2.md) - Документация второй версии API

### 🧪 Тестирование
- [🧮 Unit-тесты](testing/unit.md) - Модульное тестирование
- [🌍 E2E-тесты](testing/e2e.md) - Интеграционное тестирование 

### 🐳 Docker и окружения
- [🔄 Контуры окружения](docker/environments.md) - Особенности контуров
- [🚀 Конфигурации](docker/configs.md) - Docker-конфигурации
- [⚡ Миграции](docker/migrations.md) - Управление миграциями

### 🤖 Автоматизация
- [📜 Скрипты](automation/scripts.md) - Автоматизационные скрипты
- [🔄 CI/CD](automation/ci-cd.md) - Процессы непрерывной интеграции

### 🔒 Безопасность
- [🔐 Аутентификация](security/authentication.md) - JWT и RefreshToken
- [👮 Авторизация](security/authorization.md) - RBAC и защита эндпоинтов

## Быстрая навигация по ролям

### 🔰 Новый разработчик
1. [Настройка окружения](development/setup.md)
2. [Обзор архитектуры](architecture/README.md)
3. [Рабочий процесс](development/workflow.md)

### 🔧 DevOps
1. [Контуры окружения](docker/environments.md)
2. [Docker-конфигурации](docker/configs.md)
3. [CI/CD](automation/ci-cd.md)

### 🧪 QA
1. [E2E-тесты](testing/e2e.md)
2. [Unit-тесты](testing/unit.md)
3. [API v1](api/v1.md)

### 👨‍💻 Фронтенд-разработчик
1. [API v1](api/v1.md)
2. [Аутентификация](security/authentication.md)
3. [Авторизация](security/authorization.md)

## Часто используемые URL

### API и документация
- **API v1**: http://localhost:3000/api/v1 (порт зависит от контура)
- **Swagger v1**: http://localhost:3000/api/v1/docs
- **Swagger v2**: http://localhost:3000/api/v2/docs

### Дополнительные сервисы
- **Adminer** (dev): http://localhost:8080 - управление БД
- **Prometheus** (stage): http://localhost:9090 - метрики
- **Grafana** (stage): http://localhost:3100 - мониторинг
- **Grafana** (prod): http://localhost:3500 - мониторинг