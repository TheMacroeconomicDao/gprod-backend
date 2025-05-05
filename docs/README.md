# Документация GPROD Backend

## Навигация

### 📊 Статус и планирование
- [🗺️ Дорожная карта](ROADMAP.md) - План развития проекта
- [📈 Текущий статус](STATUS.md) - Состояние разработки 
- [📝 История изменений](CHANGELOG.md) - Журнал версий

### 🏗️ Архитектура
- [🏛️ Обзор архитектуры](architecture/README.md) - Высокоуровневая архитектура
- [📋 Подробный анализ](architecture/overview.md) - Детальный анализ архитектуры
- [🧩 Модульная структура](architecture/modules.md) - Организация кода в модули
- [🔌 Инфраструктура](architecture/infrastructure.md) - Компоненты инфраструктуры

### 🌍 Окружения
- [🌍 Обзор окружений](environments/README.md) - Система управления окружениями
- [🔧 Структура переменных](environments/environment-structure.md) - Организация .env файлов
- [🛠️ EnvironmentService](environments/environment-service.md) - Работа с переменными окружения
- [🚚 Система доставки](environments/environment-delivery.md) - Скрипты для переключения окружений

### 👨‍💻 Процесс разработки
- [🔧 Настройка окружения](development/setup.md) - Инструкция по настройке
- [📋 Рабочий процесс](development/workflow.md) - Процесс разработки
- [📝 Логирование](development/logging.md) - Система логирования
- [🤝 Контрибьютинг](development/contributing.md) - Правила внесения изменений

### 🌐 API
- [📡 Документация API](api/README.md) - Документация API проекта

### 🧪 Тестирование
- [🧮 Обзор тестирования](testing/README.md) - Общий подход к тестированию
- [🧪 Unit-тесты](testing/unit.md) - Модульное тестирование
- [🔄 E2E-тесты](testing/e2e.md) - Интеграционное тестирование 

### 🐳 Docker
- [🔄 Docker-конфигурации](docker/README.md) - Обзор Docker-конфигураций
- [🚀 Детали использования](docker/docker-details.md) - Подробности работы с Docker

### 🤖 Автоматизация
- [📜 Обзор автоматизации](automation/README.md) - Общий обзор автоматизации
- [📜 Скрипты](automation/scripts.md) - Автоматизационные скрипты
- [🔄 Интерактивный запуск](automation/interactive-run.md) - Скрипт интерактивного запуска

### 🔒 Безопасность
- [🔐 Обзор безопасности](security/README.md) - Безопасность в проекте

## Быстрая навигация по ролям

### 🔰 Новый разработчик
1. [Настройка окружения](development/setup.md)
2. [Обзор архитектуры](architecture/README.md)
3. [Рабочий процесс](development/workflow.md)

### 👨‍💻 Разработчик
1. [Управление окружениями](environments/README.md)
2. [Документация API](api/README.md)
3. [Модульная структура](architecture/modules.md)

### 🧪 QA-инженер
1. [Обзор тестирования](testing/README.md)
2. [E2E-тесты](testing/e2e.md)
3. [Управление окружениями](environments/README.md)

### 🧑‍🔧 DevOps
1. [Инфраструктура](architecture/infrastructure.md)
2. [Docker-конфигурации](docker/README.md)
3. [Система доставки окружений](environments/environment-delivery.md)

## Часто задаваемые вопросы

### Как настроить среду разработки?
См. [Настройка окружения](development/setup.md)

### Как запустить проект?
См. [Инфраструктура](architecture/infrastructure.md)

### Как переключиться между окружениями?
См. [Система доставки окружений](environments/environment-delivery.md)

### Где найти примеры API?
См. [Документация API](api/README.md)

### Как запустить тесты?
См. [Обзор тестирования](testing/README.md)