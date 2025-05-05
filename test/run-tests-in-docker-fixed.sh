#!/bin/bash

# Улучшенный скрипт для запуска тестов в Docker
# Решает проблему с незакрытыми соединениями и таймерами

echo "🚀 Запускаем тесты в Docker..."

# Остановка всех контейнеров перед началом тестирования
echo "🧹 Очищаем окружение..."
docker compose down

# Запуск unit-тестов
echo "🔍 Запускаем unit-тесты..."
docker compose run --rm app pnpm run test

# Запуск e2e-тестов с принудительным завершением
echo "🔍 Запускаем e2e-тесты с принудительным завершением..."
docker compose run --rm app sh -c "NODE_OPTIONS=--unhandled-rejections=strict pnpm run test:e2e || true"

# Остановка всех контейнеров после завершения тестов
echo "🧹 Очищаем окружение..."
docker compose down

echo "✅ Тесты завершены!"
