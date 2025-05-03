# Структура переменных окружения для GPROD API

## Общие настройки

```
# Текущий контур
NODE_ENV=development # Может быть development, staging или production

# Информация о приложении
APP_NAME=GPROD API
APP_VERSION=1.0.0
```

## Контур для тестирования (E2E-тесты)

```
TEST_JWT_SECRET=test_secret_key_for_jwt_e2e_tests
```

## DEVELOPMENT Контур

```
# Настройки сервера
DEV_PORT=3000
DEV_HOST=localhost

# База данных
DEV_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gprod_dev

# Авторизация и JWT
DEV_JWT_SECRET=dev_jwt_secret_key_change_in_production
DEV_JWT_EXPIRES=3600s
DEV_JWT_REFRESH_EXPIRES=7d

# Логирование
DEV_LOG_LEVEL=debug

# CORS и безопасность
DEV_CORS_ENABLED=true
DEV_CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## STAGING Контур

```
# Настройки сервера
STAGE_PORT=3003
STAGE_HOST=localhost
STAGE_DOMAIN=stage.gprod.com

# База данных
STAGE_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gprod_stage

# Авторизация и JWT
STAGE_JWT_SECRET=staging_jwt_secret_key_change_in_production
STAGE_JWT_EXPIRES=3600s
STAGE_JWT_REFRESH_EXPIRES=7d

# Логирование
STAGE_LOG_LEVEL=info

# CORS и безопасность
STAGE_CORS_ENABLED=true
STAGE_CORS_ORIGIN=https://stage.gprod.com
```

## PRODUCTION Контур

```
# Настройки сервера
PRODUCTION_PORT=3007
PRODUCTION_HOST=localhost
PRODUCTION_DOMAIN=gprod.com

# База данных
PRODUCTION_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gprod_prod

# Авторизация и JWT
PRODUCTION_JWT_SECRET=production_jwt_secret_key_must_be_changed
PRODUCTION_JWT_EXPIRES=3600s
PRODUCTION_JWT_REFRESH_EXPIRES=7d

# Логирование
PRODUCTION_LOG_LEVEL=info

# CORS и безопасность
PRODUCTION_CORS_ENABLED=true
PRODUCTION_CORS_ORIGIN=https://gprod.com
```

## Общие настройки базы данных

```
# База данных (общие настройки)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gprod
```

## Безопасность и ограничения

```
# Rate limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 минут в миллисекундах
RATE_LIMIT_MAX=100  # Максимальное количество запросов в окне

# Хеширование паролей
BCRYPT_ROUNDS=10  # Раунды хеширования для паролей

# Логирование
LOG_FILE_PATH=./logs/app.log
```

## Примечания

1. Значения в этом файле - только примеры. В реальной среде используйте надежные случайные значения для секретов.
2. Для production среды рекомендуется использовать внешние системы управления секретами.
3. Не коммитьте реальные .env файлы в репозиторий! Используйте .env.template и .gitignore.
4. Для JWT_SECRET используйте надежные случайные значения (минимум 32 символа).
5. Для development можно использовать значения по умолчанию для простоты настройки. 