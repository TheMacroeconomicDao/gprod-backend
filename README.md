# GPROD Backend (Gybernaty Community)

**Production-ready бэкенд на NestJS + Prisma + PostgreSQL + pnpm + Docker**

Профессиональный бэкенд-сервер с тремя контурами окружения (dev, stage, prod), ролевым доступом, JWT-аутентификацией, автоматическими миграциями, документацией API и мониторингом.

---

## TL;DR: Быстрый старт проекта
- **Клонирование репозитория:**
  ```sh
  git clone https://github.com/yourusername/gprod-new-backend.git
  cd gprod-new-backend
  pnpm install
  ```

- **Новая система окружений:**
  ```sh
  # Установка шаблонов .env файлов для всех контуров
  pnpm run env:setup
  
  # Переключение между контурами (dev, stage, prod) с автоматическим запуском 
  pnpm run env:switch:new dev   # разработка (порт 3000)
  pnpm run env:switch:new stage # тестирование (порт 3003)
  pnpm run env:switch:new prod  # продакшен (порт 3007)
  ```

- **Запуск в Docker (с автоматическими миграциями):**
  ```sh
  pnpm run docker:restart
  ```
  
- **Запуск с ручным управлением окружением:**
  ```sh
  # Запуск конкретного окружения с пересборкой контейнеров
  pnpm run docker:dev:build   # development
  pnpm run docker:stage:build # staging
  pnpm run docker:prod:build  # production
  ```

- **Запуск тестов:**
  ```sh
  # Все тесты с пересборкой
  pnpm run docker:test:rebuild
  
  # Только e2e тесты
  pnpm run docker:test:e2e
  
  # Только unit тесты
  pnpm run docker:test
  ```

- **Документация API:** 
  - v1: http://localhost:3000/api/v1/docs (порт зависит от контура)
  - v2: http://localhost:3000/api/v2/docs (подготовлена для будущих версий API)
  
- **Дополнительные сервисы:**
  - Adminer (dev): http://localhost:8080 (управление БД)
  - Prometheus (stage): http://localhost:9090 (метрики)
  - Grafana (stage/prod): http://localhost:3100 (stage) или http://localhost:3500 (prod)

- **Build info:** GET http://localhost:3000/api/v1

---

## Архитектура приложения

### Стек технологий

Проект построен на современном стеке технологий и лучших практиках разработки:

- **NestJS** — модульный бэкенд-фреймворк с DI-контейнером, декораторами и TypeScript поддержкой
- **TypeScript** — строгая типизация для безопасного рефакторинга и autocomplete
- **Prisma ORM** — типобезопасный ORM с миграциями и автогенерацией типов
- **PostgreSQL** — надёжная и производительная СУБД, поддержка JSON, индексов и транзакций
- **Docker & docker-compose** — контейнеризация для разных окружений и зависимостей
- **Swagger** — автоматическая документация API с возможностью тестирования
- **JWT** — безопасная аутентификация и авторизация с refresh токенами
- **Winston** — структурированное логирование с уровнями и форматированием
- **Jest** — модульное и e2e тестирование с покрытием
- **Class-validator** — валидация входящих данных на уровне DTOs
- **Argon2** — современное хеширование паролей
- **Prometheus & Grafana** — мониторинг и визуализация метрик

### Модульная структура проекта

Система организована в модульную структуру для легкого масштабирования и разделения ответственностей:

```
src/
├── app.module.ts               # Корневой модуль приложения
├── main.ts                     # Точка входа (bootstrap)
├── modules/                    # Функциональные модули
│   ├── auth/                   # Аутентификация и авторизация
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── strategies/         # JWT и Local стратегии
│   │   └── guards/             # Guard'ы для защиты роутов
│   ├── users/                  # Управление пользователями
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── dto/                # Data Transfer Objects
│   ├── projects/               # Управление проектами
│   │   ├── projects.module.ts
│   │   ├── projects.service.ts
│   │   ├── projects.controller.ts
│   │   └── dto/                # Data Transfer Objects
│   └── health/                 # Проверка здоровья системы
│       ├── health.module.ts
│       └── health.controller.ts
└── common/                     # Общие компоненты
    ├── config/                 # Конфигурация приложения
    ├── prisma.module.ts        # Модуль для работы с базой данных
    ├── guards/                 # Глобальные Guard'ы
    ├── filters/                # Обработчики ошибок
    ├── decorators/             # Кастомные декораторы
    ├── dto/                    # Общие DTO
    ├── helpers/                # Вспомогательные функции
    └── logger/                 # Настройка логирования
```

### Ключевые компоненты:

- **AUTH** — аутентификация (локальная + JWT), защита роутов, refresh токены
- **USERS** — управление пользователями, ролевая система, валидация
- **PROJECTS** — управление проектами, связи с пользователями, CRUD-операции
- **HEALTH** — проверка состояния приложения и базы данных

### Взаимодействие компонентов

1. **Веб-клиент** отправляет запрос на API
2. **NestJS Guards** проверяют авторизацию и права доступа
3. **Controllers** принимают запрос и валидируют данные через DTO
4. **Services** реализуют бизнес-логику
5. **Prisma ORM** обеспечивает доступ к базе данных
6. **Filters** обрабатывают возможные ошибки
7. **Winston Logger** записывает все действия

### Шаблоны проектирования

- **Dependency Injection** — автоматический инжект зависимостей
- **Repository** — абстракция доступа к данным через Prisma
- **DTO** — валидация и трансформация данных
- **Guard** — защита роутов на основе ролей и JWT
- **Interceptor** — трансформация запросов/ответов
- **Filter** — централизованная обработка ошибок

---

## Контуры окружения и новая работа с .env файлами

Проект поддерживает три контура окружения с независимыми настройками и конфигурациями:

### 1. Development (dev) — для локальной разработки

- **Порт**: 3000
- **База данных**: PostgreSQL на порту 5432
- **Дополнительные сервисы**: 
  - **Adminer**: инструмент управления БД через веб-интерфейс (порт 8080)
  - **E2E тесты**: интеграционное тестирование

**Особенности контура**:
- Hot Reload для быстрой разработки (изменения кода применяются автоматически)
- Автоматическое создание и применение миграций
- Развернутые логи отладки
- Volumes для прямого редактирования кода
   
### 2. Staging (stage) — для тестирования перед релизом

- **Порт**: 3003
- **База данных**: PostgreSQL на порту 5433 (чтобы избежать конфликтов с dev)
- **Дополнительные сервисы**:
  - **Prometheus**: сбор метрик (порт 9090)
  - **Grafana**: визуализация метрик и дашборды (порт 3100)

**Особенности контура**:
- Окружение, максимально приближенное к продакшену
- Применение только существующих миграций
- Продакшен-подобная конфигурация с ограничением ресурсов
- Мониторинг производительности

### 3. Production (prod) — для боевого окружения

- **Порт**: 3007 (через Nginx с SSL)
- **База данных**: PostgreSQL с выделенным volume для данных
- **Дополнительные сервисы**:
  - **Nginx**: прокси-сервер с SSL и оптимизацией
  - **Grafana**: мониторинг (порт 3500)
  - **Redis**: кэширование и очереди (опционально)

**Особенности контура**:
- Оптимизированная сборка для производительности
- Защита чувствительных данных и настроек
- Restartability и высокая отказоустойчивость
- SSL-шифрование и дополнительные настройки безопасности

### Новая система управления переменными окружения

В проекте реализована улучшенная система управления конфигурациями через отдельные .env файлы для каждого окружения:

```sh
# Создать шаблоны .env файлов для всех окружений
pnpm run env:setup   # создаёт файлы в .env-templates/

# Переключение между окружениями (автоматически создаёт .env из шаблона, если не существует)
pnpm run env:dev:new      # активирует development (.env.development → .env)
pnpm run env:stage:new    # активирует staging (.env.staging → .env)
pnpm run env:prod:new     # активирует production (.env.production → .env)

# Интерактивное переключение
pnpm run env:switch:new   # выбор окружения через CLI-интерфейс
```

#### Структура файлов окружения:

- `.env.development` — настройки для разработки
- `.env.staging` — настройки для тестового окружения
- `.env.production` — настройки для боевого сервера

```bash
# Пример содержимого .env.development
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_dev
JWT_SECRET=dev_jwt_secret_change_me_in_production
JWT_EXPIRES=3600s
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

**EnvHelper** — класс-помощник для удобной работы с переменными окружения:
- Автоматически выбирает нужную переменную в зависимости от текущего контура
- Поддерживает обратную совместимость с префиксами (DEV_, STAGE_, PRODUCTION_)
- Предоставляет типизированные методы для получения значений (get, int, bool, array)
- Кэширует значения для оптимизации производительности

```typescript
// Примеры использования EnvHelper
const port = EnvHelper.int('PORT', 3000);  // Числовое значение с fallback
const jwtSecret = EnvHelper.get('JWT_SECRET', undefined, true);  // Строковое значение, обязательное
const isDebug = EnvHelper.bool('DEBUG', false);  // Логическое значение
const allowedOrigins = EnvHelper.array('CORS_ORIGIN', ['localhost']);  // Массив значений
```

---

## Миграции и работа с базой данных

### Схема базы данных

Проект использует Prisma ORM с централизованной схемой в `schema.prisma`:

```prisma
// Основные сущности

model User {
  id            Int            @id @default(autoincrement())
  username      String         @unique @db.VarChar(64)
  email         String         @unique @db.VarChar(128)
  password      String
  isActive      Boolean        @default(true)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  projects      Project[]
  roles         String[]       @default(["user"])
  refreshTokens RefreshToken[]
}

model Project {
  id          Int      @id @default(autoincrement())
  title       String   @db.VarChar(128)
  description String?
  ownerId     Int?
  owner       User?    @relation(fields: [ownerId], references: [id], onDelete: SetNull)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model RefreshToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  expiresAt DateTime
}
```

### Автоматизация миграций

Реализована полностью автоматизированная система миграций с разными стратегиями в зависимости от окружения:

#### В development-режиме (NODE_ENV=development):
- Изменения в `schema.prisma` автоматически отражаются в базе данных
- Миграции создаются и применяются автоматически при запуске
- Сиды (тестовые данные) для разработки применяются при необходимости
- Поддержка отката миграций и генерации SQL-скриптов

#### В staging/production-режимах:
- Применяются только существующие миграции через `prisma migrate deploy`
- Строгий контроль версий схемы базы данных
- Предотвращение потери данных и случайных изменений
- Fail-fast политика: приложение не стартует при несоответствии схемы

#### Проверка схемы перед запуском:
```typescript
// main.ts - проверка наличия обязательных полей в схеме
async function checkSchema() {
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRawUnsafe('SELECT roles FROM "User" LIMIT 1');
  } catch (e) {
    console.error('FATAL: "roles" column missing in "User" table. Run migrations!');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
```

### Скрипты для работы с базой данных

```sh
# Разработка и миграции
pnpm run prisma:migrate:dev      # создание и применение миграций для development
pnpm run prisma:migrate:stage    # применение миграций для staging
pnpm run prisma:migrate:prod     # применение миграций для production

# Docker-версии команд
pnpm run docker:prisma:migrate:dev   # миграции в Docker для development
pnpm run docker:prisma:migrate:stage # миграции в Docker для staging
pnpm run docker:prisma:migrate:prod  # миграции в Docker для production

# Prisma Studio - графический интерфейс для управления данными
pnpm run prisma:studio:dev       # для development БД
pnpm run prisma:studio:stage     # для staging БД
pnpm run prisma:studio:prod      # для production БД

# Генерация Prisma клиента
pnpm run docker:prisma:generate  # создание TypeScript типов из схемы
```

### Миграции в директории проекта

Директория `prisma/migrations/` содержит все миграции с SQL-скриптами:

```
prisma/migrations/
├── 20250502025251_init/             # Начальная миграция
│   └── migration.sql
├── 20250503123000_add_refresh_token/ # Добавление RefreshToken модели
│   └── migration.sql
└── 20250503150000_add_roles_column/  # Добавление поля roles в User
    └── migration.sql
```

---

## Безопасность

Проект включает комплексные механизмы защиты на разных уровнях:

### 1. Аутентификация и авторизация

- **JWT (JSON Web Tokens)** для безопасной аутентификации
  - Access токены с коротким временем жизни (15 минут)
  - Refresh токены для продления сессии (7 дней)
  - Хранение refresh токенов в базе для возможности отзыва
  
- **Argon2** — современный алгоритм хеширования паролей
  - Устойчивость к атакам перебором и rainbow-таблицам
  - Параметризуемая вычислительная сложность

- **Passport.js** интеграция с NestJS
  - Стратегия Local для логина по username/password
  - Стратегия JWT для проверки токенов

### 2. Ролевая система доступа (RBAC)

- **Roles Guard** — декларативная защита эндпоинтов по ролям
  ```typescript
  @Roles('admin')  // Доступ только для администраторов
  @Get('sensitive-data')
  getSensitiveData() {
    // ...
  }
  ```

- **Роли пользователей** хранятся в базе данных как массив строк
  - Базовые роли: 'user', 'admin'
  - Возможность расширения для более сложных сценариев

### 3. Защита от атак

- **Rate Limiting** — ограничение частоты запросов
  - Глобально: защита от массовых запросов
  - Декоративно: более строгие ограничения для критичных эндпоинтов
  ```typescript
  @RateLimit(5, 60)  // 5 запросов в минуту
  @Post('login')
  login() {
    // ...
  }
  ```

- **Helmet** — настройка безопасных HTTP заголовков
  - Content Security Policy (CSP) для защиты от XSS
  - Strict-Transport-Security для принудительного HTTPS
  - X-XSS-Protection, X-Frame-Options и другие заголовки
  
- **CORS** (Cross-Origin Resource Sharing) настройка
  - Белый список разрешённых доменов из переменных окружения
  - Настройка для различных типов запросов и заголовков

### 4. Валидация и санитизация данных

- **Class-validator и class-transformer** для DTO
  - Автоматическая валидация входящих данных
  - Защита от инъекций и некорректных данных
  ```typescript
  export class CreateUserDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    username: string;
    
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    password: string;
  }
  ```
  
- **Request Size Limiting** — защита от DoS-атак
  ```typescript
  app.use(express.json({ limit: '1mb' }));
  ```

### 5. Безопасность в Production

- **Скрытие чувствительной информации** в продакшен режиме
  - Версии и хеши коммитов не отображаются в API-ответах
  - Детализация ошибок минимизирована
  
- **Принудительные HTTPS** через Nginx в production
  - Автоматическое перенаправление с HTTP на HTTPS
  - SSL/TLS настройки с современными шифрами

---

## Быстрый старт и тестирование

### 1. Клонируй репозиторий и настрой окружение
```sh
# Установка шаблонов .env файлов
pnpm run env:setup

# Выбор контура окружения (dev, stage или prod)
pnpm run env:dev:new
```

### 2. Запусти всё в Docker
```sh
pnpm run docker:restart
```

### 3. Swagger UI
- v1: http://localhost:3000/api/v1/docs (порт зависит от контура)
- v2: http://localhost:3000/api/v2/docs

### 4. Тесты (unit + e2e)
```sh
pnpm run docker:test:rebuild
# или только e2e:
pnpm run docker:test:e2e
```

---

## Основные эндпоинты

### Auth
- **POST /api/v1/auth/register** — регистрация
- **POST /api/v1/auth/login** — логин (JWT)
- **POST /api/v1/auth/refresh** — обновление токена

### Users
- **GET /api/v1/users** — список (пагинация, поиск, сортировка)
- **GET /api/v1/users/:id** — по id
- **POST /api/v1/users** — создать
- **PATCH /api/v1/users/:id** — обновить
- **DELETE /api/v1/users/:id** — удалить (soft-delete)

### Projects
- **GET /api/v1/projects** — список (JWT, пагинация, поиск, сортировка)
- **GET /api/v1/projects/:id** — по id (JWT)
- **POST /api/v1/projects** — создать (JWT)
- **PATCH /api/v1/projects/:id** — обновить (JWT)
- **DELETE /api/v1/projects/:id** — удалить (JWT, роль: admin)

### Health
- **GET /api/v1/health** — статус приложения и базы

---

## Примеры curl

```sh
# Регистрация
curl -X POST http://localhost:3007/api/v1/auth/register -H 'Content-Type: application/json' -d '{"username":"vasya","email":"vasya@mail.com","password":"qwerty"}'

# Логин
curl -X POST http://localhost:3007/api/v1/auth/login -H 'Content-Type: application/json' -d '{"username":"vasya","password":"qwerty"}'

# Получить пользователей
curl http://localhost:3007/api/v1/users

# Получить проекты (JWT)
curl http://localhost:3007/api/v1/projects -H 'Authorization: Bearer <token>'

# Health-check
curl http://localhost:3007/api/v1/health
```

---

## Тестирование

Проект включает в себя как юнит-тесты, так и e2e-тесты:

### Умное тестирование с автоопределением окружения

В проекте реализована улучшенная система запуска тестов, которая автоматически:

- Определяет, запущены ли тесты локально или в Docker
- Настраивает подключение к базе данных соответствующим образом
- Проверяет наличие базы данных и создает ее при необходимости

Команды для запуска тестов:

```bash
# Настройка файлов окружения для тестов
pnpm run test:setup

# Запуск юнит-тестов с автоопределением окружения
pnpm run test:smart:unit

# Запуск e2e-тестов с автоопределением окружения
pnpm run test:smart:e2e

# Запуск всех тестов
pnpm run test:smart
```

Подробная документация:
- [Управление окружениями и тестирование](docs/env-management.md)

---

## Мониторинг и логирование

- **Prometheus** — сбор метрик (доступен в stage/prod)
- **Grafana** — визуализация метрик и дашборды
- **Winston Logger** — структурированное логирование

Доступ:
- Prometheus: http://localhost:9090 (только stage)
- Grafana: http://localhost:3100 (stage) или http://localhost:3500 (prod)

---

## Скрипты (package.json)

### Docker и окружения
```sh
# Запуск Docker
pnpm run docker:dev           # development
pnpm run docker:dev:build     # пересборка development
pnpm run docker:stage         # staging
pnpm run docker:stage:build   # пересборка staging
pnpm run docker:prod          # production
pnpm run docker:prod:build    # пересборка production

# Окружения (новый подход)
pnpm run env:setup            # создать шаблоны .env файлов
pnpm run env:switch:new       # интерактивный выбор окружения
pnpm run env:dev:new          # активировать development
pnpm run env:stage:new        # активировать staging
pnpm run env:prod:new         # активировать production

# Тесты
pnpm run docker:test          # unit тесты в Docker
pnpm run docker:test:e2e      # e2e тесты в Docker
```

---

## Частые вопросы (FAQ)

- **Почему нет подключения к БД в stage/prod?** — Проверь порты и DATABASE_URL в .env файле. Для stage порт БД 5433 вместо 5432.
- **Почему gitHash может быть unknown?** — Если .git не скопирован в Docker-образ (production best practice).
- **Как сменить порт?** — Измени PORT в соответствующем .env файле.
- **Как добавить новые переменные?** — Добавь в .env файлы контуров и используй через EnvHelper.
- **Как исправить ошибку "roles column missing"?** — Примени миграцию: pnpm run prisma:migrate:dev (или другую для нужного контура).

---

## Рекомендации по развитию проекта

### Архитектурные улучшения
1. **Реализация CQRS** для более сложных бизнес-кейсов
2. **Микросервисная архитектура** для масштабирования
3. **Event-driven подход** для асинхронной обработки событий

### Технические улучшения
1. **Кэширование через Redis** для повышения производительности
2. **CI/CD пайплайн** для автоматизации деплоя
3. **Более детальный мониторинг** с custom метриками

### Функциональные улучшения
1. **Гибкая система ролей и разрешений**
2. **OAuth интеграция** для авторизации через соцсети
3. **Многоязычность** (i18n) для интернационализации

---

## Вклад в проект (contributing)
- Пиши тесты к фичам и багфиксам
- Соблюдай архитектуру (модули, DI, DTO, Guards)
- Не коммить .env файлы, node_modules, логи, временные файлы
- Перед PR: `pnpm run lint && pnpm run test`

---

## Полезные ссылки
- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [pnpm Docs](https://pnpm.io/)
- [Docker Docs](https://docs.docker.com/)
- [JWT.io](https://jwt.io/)

---

## Лицензия
MIT (см. LICENSE)

---

**GPROD by Gybernaty** — чистый, production-ready бэкенд. Вопросы/PR — welcome.
