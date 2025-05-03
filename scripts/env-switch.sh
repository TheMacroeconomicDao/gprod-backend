#!/bin/bash

# Скрипт для переключения между контурами окружения: dev, stage, prod

# Проверка наличия аргумента
if [ $# -ne 1 ]; then
    echo "Использование: $0 <dev|stage|prod>"
    exit 1
fi

ENV=$1

# Проверка корректности аргумента
if [ "$ENV" != "dev" ] && [ "$ENV" != "stage" ] && [ "$ENV" != "prod" ]; then
    echo "Ошибка: допустимые значения - dev, stage или prod"
    exit 1
fi

# Папка проекта
PROJECT_DIR=$(pwd)

# Остановка всех контейнеров
echo "📦 Останавливаем контейнеры всех окружений..."
docker compose -f docker-compose.dev.yml down 2>/dev/null
docker compose -f docker-compose.stage.yml down 2>/dev/null
docker compose -f docker-compose.prod.yml down 2>/dev/null

# Выбор окружения
case $ENV in
    "dev")
        echo "🚀 Запускаем DEVELOPMENT окружение..."
        docker compose -f docker-compose.dev.yml up -d
        echo "✅ Окружение DEVELOPMENT запущено"
        echo "🔗 API доступен по адресу: http://localhost:3000"
        echo "🔗 Adminer доступен по адресу: http://localhost:8080"
        ;;
    "stage")
        echo "🚀 Запускаем STAGING окружение..."
        docker compose -f docker-compose.stage.yml up -d
        echo "✅ Окружение STAGING запущено"
        echo "🔗 API доступен по адресу: http://localhost:3003"
        echo "🔗 Prometheus доступен по адресу: http://localhost:9090"
        echo "🔗 Grafana доступна по адресу: http://localhost:3100"
        ;;
    "prod")
        echo "🚀 Запускаем PRODUCTION окружение..."
        docker compose -f docker-compose.prod.yml up -d
        echo "✅ Окружение PRODUCTION запущено"
        echo "🔗 API доступен по адресу: https://localhost (через Nginx, порт 443)"
        echo "🔗 Grafana доступна по адресу: http://localhost:3500"
        ;;
esac

echo ""
echo "📋 Статус запущенных контейнеров:"
docker ps

echo ""
echo "💡 Используйте следующие команды для управления окружением:"
echo "    - pnpm run docker:$ENV - запуск окружения"
echo "    - pnpm run docker:$ENV:stop - остановка окружения"
echo "    - pnpm run docker:$ENV:build - пересборка и запуск окружения" 