# Структура переменных окружения

## Форматы файлов окружения

Для каждого контура используется отдельный файл переменных окружения, содержащий специфические для этого контура настройки:

### Файловая структура

```
.env.development   # Переменные для development
.env.staging       # Переменные для staging
.env.production    # Переменные для production
.env.test          # Переменные для тестирования
.env               # Активный файл (копия из одного из вышеперечисленных)
.env-templates/    # Директория с шаблонами
```

## Структура контуров окружения

Каждый контур имеет свой набор переменных, соответствующий его назначению. Ниже представлены основные группы переменных для каждого контура.

### Development (.env.development)

```dotenv
# Основные настройки окружения
NODE_ENV=development
PORT=3000

# База данных
DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_dev

# Авторизация и JWT
JWT_SECRET=dev_jwt_secret_change_me_in_production
JWT_EXPIRES=3600s
JWT_REFRESH_EXPIRES=7d

# Логирование
LOG_LEVEL=debug
ENABLE_QUERY_LOGS=true

# Для разработчиков
DEBUG=true
ENABLE_SWAGGER=true
CORS_ORIGIN=*
```

### Staging (.env.staging)

```dotenv
# Основные настройки окружения
NODE_ENV=staging
PORT=3100

# База данных
DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_stage

# Авторизация и JWT
JWT_SECRET=stage_jwt_secret_change_me_in_production
JWT_EXPIRES=3600s
JWT_REFRESH_EXPIRES=7d

# Логирование
LOG_LEVEL=info
ENABLE_QUERY_LOGS=true

# Настройки мониторинга
ENABLE_METRICS=true
METRICS_PORT=9100

# Безопасность и доступ
CORS_ORIGIN=https://stage-app.example.com
```

### Production (.env.production)

```dotenv
# Основные настройки окружения
NODE_ENV=production
PORT=3200

# База данных
DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_prod

# Авторизация и JWT
JWT_SECRET=prod_jwt_secret_use_strong_value_here
JWT_EXPIRES=900s
JWT_REFRESH_EXPIRES=7d

# Логирование
LOG_LEVEL=warn
ENABLE_QUERY_LOGS=false

# Настройки мониторинга
ENABLE_METRICS=true
METRICS_PORT=9200

# Безопасность
CORS_ORIGIN=https://app.example.com
RATE_LIMIT=100
```

### Test (.env.test)

```dotenv
# Основные настройки окружения
NODE_ENV=test
PORT=3300

# База данных
DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_test

# Авторизация и JWT
JWT_SECRET=test_jwt_secret
JWT_EXPIRES=3600s
JWT_REFRESH_EXPIRES=7d

# Логирование
LOG_LEVEL=error
ENABLE_QUERY_LOGS=false
```

## Группы переменных окружения

Для удобства поддержки, все переменные окружения сгруппированы по функциональным блокам:

### Основные настройки

| Переменная | Описание | Пример |
|------------|----------|--------|
| `NODE_ENV` | Контур окружения | `development`, `staging`, `production`, `test` |
| `PORT` | Порт для API | `3000`, `3100`, `3200` |
| `HOST` | Хост для API | `localhost`, `0.0.0.0` |
| `API_PREFIX` | Префикс для всех API эндпоинтов | `/api/v1` |

### База данных

| Переменная | Описание | Пример |
|------------|----------|--------|
| `DATABASE_URL` | URL подключения к PostgreSQL | `postgresql://user:pass@host:port/db` |
| `DB_MIGRATIONS` | Флаг автоматического применения миграций | `true`, `false` |

### Аутентификация и безопасность

| Переменная | Описание | Пример |
|------------|----------|--------|
| `JWT_SECRET` | Секретный ключ для JWT | `your-secret-key` |
| `JWT_EXPIRES` | Время жизни JWT | `15m`, `1h`, `1d` |
| `JWT_REFRESH_EXPIRES` | Время жизни Refresh-токена | `7d`, `30d` |
| `CORS_ORIGIN` | Разрешенные источники для CORS | `*`, `https://example.com` |
| `RATE_LIMIT` | Лимит запросов в минуту | `100`, `500` |

### Логирование

| Переменная | Описание | Пример |
|------------|----------|--------|
| `LOG_LEVEL` | Минимальный уровень логов | `debug`, `info`, `warn`, `error` |
| `ENABLE_QUERY_LOGS` | Логирование запросов к БД | `true`, `false` |
| `LOG_FORMAT` | Формат логов | `json`, `simple` |

### Дополнительные сервисы

| Переменная | Описание | Пример |
|------------|----------|--------|
| `REDIS_URL` | URL подключения к Redis | `redis://localhost:6379` |
| `KAFKA_BROKERS` | Список брокеров Kafka | `localhost:9092` |
| `ENABLE_METRICS` | Включение сбора метрик | `true`, `false` |
| `METRICS_PORT` | Порт для Prometheus метрик | `9100` |

## Особенности хранения секретов

### Правила безопасности

1. **Не храните реальные секреты в git** - только шаблоны и примеры
2. **Используйте отдельные .env файлы** для каждого окружения
3. **Генерируйте уникальные значения** для JWT_SECRET и других секретов в каждом окружении
4. **Используйте системы управления секретами** для production (Vault, AWS Secrets Manager и т.д.)

### Шаблоны в .env-templates

В репозитории хранятся только шаблоны .env файлов с примерами значений, но без реальных секретов:

```
.env-templates/
├── .env.development.template
├── .env.staging.template
├── .env.production.template
└── .env.test.template
```

Пример .env.development.template:

```dotenv
# Основные настройки
NODE_ENV=development
PORT=3000
HOST=localhost
API_PREFIX=/api/v1

# База данных (замените значения на свои)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gprod_dev

# Секреты (замените значения на свои)
JWT_SECRET=dev_jwt_secret_change_me
JWT_EXPIRES=1h
```

## Правила именования переменных

1. **ВЕРХНИЙ_РЕГИСТР** для всех переменных
2. **Разделение подчеркиванием** между словами
3. **Префикс модуля** для связанных переменных (например, `JWT_*`)
4. **Логичные суффиксы**:
   - `_URL` для URL-адресов
   - `_PORT` для портов
   - `_SECRET` для секретов
   - `_ENABLED` для флагов
   - `_PATH` для путей к файлам
