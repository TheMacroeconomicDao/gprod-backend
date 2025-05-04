#!/bin/bash

# Скрипт для создания шаблонов .env файлов для трех окружений

# Создаем директорию для шаблонов
mkdir -p .env-templates

# Создаем шаблон для development
cat > .env-templates/.env.development << 'EOL'
# Основные настройки окружения
NODE_ENV=development
PORT=3000

# База данных
DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_dev

# JWT и авторизация
JWT_SECRET=dev_jwt_secret_change_me_in_production
JWT_EXPIRES=3600s
JWT_REFRESH_EXPIRES=7d

# Логирование
LOG_LEVEL=debug

# CORS и безопасность
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Дополнительные настройки
APP_NAME=GPROD API (Dev)
APP_VERSION=1.0.0
HOST=localhost
DOMAIN=localhost

# Postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gprod_dev
EOL

# Создаем шаблон для staging
cat > .env-templates/.env.staging << 'EOL'
# Основные настройки окружения
NODE_ENV=staging
PORT=3003

# База данных
DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_stage

# JWT и авторизация
JWT_SECRET=stage_jwt_secret_change_me_in_production
JWT_EXPIRES=3600s
JWT_REFRESH_EXPIRES=7d

# Логирование
LOG_LEVEL=info

# CORS и безопасность
CORS_ENABLED=true
CORS_ORIGIN=https://stage.gprod.com,https://stage-admin.gprod.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Дополнительные настройки
APP_NAME=GPROD API (Staging)
APP_VERSION=1.0.0
HOST=localhost
DOMAIN=stage.gprod.com

# Postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gprod_stage

# Prometheus и Grafana
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=admin
EOL

# Создаем шаблон для production
cat > .env-templates/.env.production << 'EOL'
# Основные настройки окружения
NODE_ENV=production
PORT=3007

# База данных
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/gprod_prod

# JWT и авторизация
JWT_SECRET=super_secure_jwt_secret_for_production
JWT_EXPIRES=1h
JWT_REFRESH_EXPIRES=30d

# Логирование
LOG_LEVEL=info

# CORS и безопасность
CORS_ENABLED=true
CORS_ORIGIN=https://gprod.com,https://admin.gprod.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Дополнительные настройки
APP_NAME=GPROD API
APP_VERSION=1.0.0
HOST=localhost
DOMAIN=gprod.com

# Postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=super_secure_postgres_password
POSTGRES_DB=gprod_prod

# Redis для кэширования
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=super_secure_redis_password

# Prometheus и Grafana
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=super_secure_grafana_password
EOL

# Создаем шаблон для тестового окружения
cat > .env-templates/.env.test << 'EOL'
# Основные настройки окружения для тестов
NODE_ENV=test
PORT=3007

# База данных для тестов
# Примечание: Для локальных тестов используйте localhost:5432, для Docker - db:5432
# EnvHelper автоматически выберет правильный URL в зависимости от окружения
DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_test

# Если используем докер напрямую - эти переменные будут переопределены через env
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gprod_test

# JWT и авторизация для тестов
JWT_SECRET=test_jwt_secret
TEST_JWT_SECRET=test_secret_key_for_testing_only
JWT_EXPIRES=1h
JWT_REFRESH_EXPIRES=7d

# Логирование (минимизируем в тестах)
LOG_LEVEL=error

# CORS и безопасность
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:3007
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=1000

# Дополнительные настройки
APP_NAME=GPROD API (Test)
APP_VERSION=1.0.0
HOST=localhost
DOMAIN=localhost

# Для определения, запущены ли тесты в Docker
RUNNING_IN_DOCKER=false
EOL

echo "Шаблоны .env файлов созданы в директории .env-templates"
echo "Скопируйте их в корень проекта и переименуйте соответственно:"
echo "  .env-templates/.env.development -> .env.development"
echo "  .env-templates/.env.staging -> .env.staging"
echo "  .env-templates/.env.production -> .env.production"
echo "  .env-templates/.env.test -> .env.test" 