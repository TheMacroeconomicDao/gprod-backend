#!/bin/bash

# Запуск тестов в Docker с корректными параметрами
echo "🚀 Запускаем тесты в Docker..."

# Запуск unit-тестов
echo "🔍 Запускаем unit-тесты..."
docker compose run --rm app pnpm run test

# Запуск e2e-тестов с принудительным завершением
echo "🔍 Запускаем e2e-тесты..."
docker compose run --rm app pnpm run test:e2e

echo "✅ Тесты завершены!"
