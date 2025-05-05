# Управление окружениями в GPROD Backend

## Обзор системы окружений

GPROD Backend использует гибкую систему управления переменными окружения, которая поддерживает четыре основных контура:

| Контур | Описание | Файл конфигурации | Порт API |
|--------|----------|-------------------|----------|
| **Development** (`dev`) | Для локальной разработки | `.env.development` | 3000 |
| **Staging** (`stage`) | Для тестирования перед продакшеном | `.env.staging` | 3100 |
| **Production** (`prod`) | Для промышленной эксплуатации | `.env.production` | 3200 |
| **Test** (`test`) | Специально для запуска тестов | `.env.test` | 3300 |

## Файлы окружения

Для каждого контура используется отдельный файл переменных окружения:

- `.env.development` - переменные для разработки
- `.env.staging` - переменные для staging-среды
- `.env.production` - переменные для продакшена
- `.env.test` - специальные переменные для тестов

Шаблоны этих файлов находятся в директории `.env-templates/`.

### Преимущества отдельных .env файлов

1. **Изоляция конфигураций** - каждый контур имеет свой набор переменных
2. **Безопасность** - меньший риск утечки продакшн-параметров в другие окружения
3. **Прозрачность** - легко увидеть полную конфигурацию для каждого контура
4. **Версионный контроль** - можно хранить шаблоны или некритичные параметры в системе контроля версий
5. **Упрощение CI/CD** - легко интегрировать с системами CI/CD

### Файловая структура

```
.env.development   # Переменные для development
.env.staging       # Переменные для staging
.env.production    # Переменные для production
.env.test          # Переменные для тестирования
.env               # Активный файл (копия из одного из вышеперечисленных)
```

## Класс EnvHelper

В проекте используется класс `EnvHelper` для удобной и безопасной работы с переменными окружения:

```typescript
// Примеры использования
const dbUrl = EnvHelper.get('DATABASE_URL', undefined, true); // Строка, обязательная
const port = EnvHelper.int('PORT', 3000); // Число с дефолтным значением
const isDebug = EnvHelper.bool('DEBUG', false); // Булево значение
const origins = EnvHelper.array('CORS_ORIGIN', ['localhost']); // Массив строк
```

### Особенности EnvHelper

1. **Автоопределение контура** - определяет текущий контур на основе `NODE_ENV`
2. **Типизированные методы** - получение переменных с автоматическим приведением типов
3. **Валидация** - проверка наличия обязательных переменных
4. **Значения по умолчанию** - гибкая настройка дефолтных значений

### Методы EnvHelper

- `EnvHelper.get(key, defaultValue, required)` - получение строкового значения
- `EnvHelper.int(key, defaultValue)` - получение целочисленного значения
- `EnvHelper.float(key, defaultValue)` - получение значения с плавающей точкой
- `EnvHelper.bool(key, defaultValue)` - получение булева значения
- `EnvHelper.array(key, defaultValue)` - получение массива строк
- `EnvHelper.json(key, defaultValue)` - получение и парсинг JSON-объекта

## Работа с базой данных

Для каждого окружения используется своя база данных:

- `gprod_dev` - для development
- `gprod_stage` - для staging 
- `gprod_prod` - для production
- `gprod_test` - для тестирования

### Миграции

```bash
# Миграции для development
pnpm run prisma:migrate:dev

# Миграции для staging
pnpm run prisma:migrate:stage

# Миграции для production
pnpm run prisma:migrate:prod
```

## Docker Compose

Для каждого окружения используется отдельный Docker Compose файл:

- `docker-compose.dev.yml` - для development
- `docker-compose.stage.yml` - для staging
- `docker-compose.prod.yml` - для production

## Обратная совместимость

Для обратной совместимости со старым подходом (с префиксами) `EnvHelper` поддерживает:

- Переменные с префиксами `DEV_`, `STAGE_` и `PRODUCTION_`
- Логику fallback между контурами

## Критические переменные окружения

| Переменная | Описание | Пример значения |
|------------|----------|-----------------|
| `NODE_ENV` | Текущий контур окружения | `development`, `staging`, `production`, `test` |
| `DATABASE_URL` | URL для подключения к PostgreSQL | `postgresql://postgres:password@localhost:5432/gprod_db` |
| `JWT_SECRET` | Секретный ключ для JWT | `your-secret-key-here` |
| `JWT_EXPIRES` | Время жизни JWT токена | `15m` |
| `REFRESH_TOKEN_EXPIRES` | Время жизни Refresh токена | `7d` |
| `LOG_LEVEL` | Уровень детализации логирования | `debug`, `info`, `warn`, `error` |

## Лучшие практики

1. **Никогда не храните чувствительные данные в контроле версий**
2. **Используйте шаблоны .env файлов** с пустыми или примерными значениями
3. **Документируйте переменные окружения** в шаблонах и ReadMe
4. **Используйте разные пароли** для разных контуров
5. **Регулярно обновляйте секреты** в продакшен-окружении
6. **Используйте EnvHelper** вместо прямого доступа к process.env
7. **Выполняйте валидацию** всех переменных окружения при старте приложения

## Управление окружениями (контурами)

В проекте реализована гибкая система управления окружениями, которая поддерживает четыре основных контура:

- **Development** (`NODE_ENV=development`) - для локальной разработки
  - Порт по умолчанию: 3000
  - Оптимизирован для быстрой разработки
  - Подробные логи, автоперезагрузка

- **Staging** (`NODE_ENV=staging`) - для тестирования перед продакшеном
  - Порт по умолчанию: 3100
  - Включены метрики и мониторинг
  - Имитирует продакшен-окружение для тестирования

- **Production** (`NODE_ENV=production`) - боевое окружение
  - Порт по умолчанию: 3200
  - Оптимизировано для производительности
  - Строгие настройки безопасности

- **Test** (`NODE_ENV=test`) - специально для запуска тестов
  - Порт по умолчанию: 3300
  - Конфигурация для запуска unit и e2e тестов

## Система EnvHelper

`EnvHelper` - это специальный класс, который предоставляет удобный и типобезопасный доступ к переменным окружения.

### Основные возможности

- **Автоопределение контура** - определяет текущий контур на основе `NODE_ENV`
- **Типизированный доступ** - методы для получения строк, чисел, булевых значений и массивов
- **Fallback значения** - можно указать значение по умолчанию
- **Валидация** - проверка наличия обязательных переменных
- **Кэширование** - для оптимизации производительности
- **Определение контекста выполнения** - методы для определения запуска в Docker или локально

### Основные методы

```typescript
// Получение строкового значения (с опциональным fallback и валидацией)
EnvHelper.get('KEY', 'default_value', required);

// Получение числового значения
EnvHelper.int('KEY', 123, required);

// Получение логического значения
EnvHelper.bool('KEY', false, required);

// Получение массива строк (разделенных запятыми)
EnvHelper.array('KEY', ['default'], required);

// Специализированные методы для часто используемых переменных
EnvHelper.getDatabaseUrl();
EnvHelper.getJwtSecret();
EnvHelper.getJwtExpires();
```

### Вспомогательные методы

```typescript
// Проверка окружения
EnvHelper.isDevelopment
EnvHelper.isStaging
EnvHelper.isProduction
EnvHelper.isTest

// Определение запуска в Docker
EnvHelper.isDocker

// Очистка кэша
EnvHelper.clearCache()
```

## Рекомендации по использованию

1. ✅ Всегда используйте `EnvHelper` для доступа к переменным окружения вместо прямого обращения к `process.env`
2. ✅ Определяйте обязательные переменные через параметр `required = true`
3. ✅ Не храните чувствительные данные в репозитории - используйте переменные окружения
4. ✅ При добавлении новых переменных обновляйте шаблоны в `.env-templates/`
5. ✅ Синхронизируйте переменные окружения между основным и инфраструктурным репозиториями

## Структура переменных окружения

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
