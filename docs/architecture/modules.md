# Модульная архитектура GPROD

## Общая структура

Проект организован по принципу модульной архитектуры для достижения лучшей тестируемости и масштабируемости. Ключевой принцип - разделение ответственности и инкапсуляция логики в отдельные модули.

```
src/
├── app.module.ts               # Корневой модуль приложения
├── main.ts                     # Точка входа (bootstrap)
├── modules/                    # Бизнес-модули
│   ├── auth/                   # Аутентификация и авторизация
│   ├── users/                  # Управление пользователями
│   ├── projects/               # Управление проектами
│   └── health/                 # Проверка здоровья системы
└── common/                     # Общие модули и компоненты
    ├── database/               # Модуль работы с базой данных
    ├── environment/            # Модуль для переменных окружения
    ├── security/               # Модуль безопасности
    ├── upload/                 # Модуль для работы с файлами
    ├── config/                 # Конфигурация приложения
    ├── logger/                 # Настройка логирования
    ├── middleware/             # HTTP middleware
    ├── filters/                # Обработчики ошибок
    ├── decorators/             # Кастомные декораторы
    ├── dto/                    # Общие DTO
    └── helpers/                # Вспомогательные функции
```

## Принципы модульной архитектуры

Проект следует следующим ключевым принципам:

1. **Модульность** - каждый функциональный блок выделен в отдельный модуль
2. **Инкапсуляция** - модули скрывают внутреннюю реализацию, экспортируя только нужные компоненты
3. **Dependency Injection** - зависимости внедряются через конструкторы, а не создаются внутри классов
4. **Single Responsibility** - каждый класс отвечает за одну конкретную функциональность
5. **DTO для передачи данных** - использование Data Transfer Objects для структурированной передачи данных
6. **Централизованная обработка ошибок** - глобальные фильтры перехватывают и обрабатывают исключения

### Преимущества модульной организации

- ✅ **Улучшенная тестируемость** - модули можно тестировать изолированно
- ✅ **Более чистый код** - четкая структура и разграничение ответственности
- ✅ **Повторное использование** - модули можно использовать в разных частях приложения
- ✅ **Проще масштабирование** - новые функции можно добавлять в виде отдельных модулей
- ✅ **Облегченное сопровождение** - изменения в одном модуле не затрагивают другие

## Основные инфраструктурные модули

### DatabaseModule

Модуль для работы с базой данных через Prisma ORM.

```typescript
// src/common/database/database.module.ts
@Module({
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor
    }
  ],
  exports: [PrismaService]
})
export class DatabaseModule {}
```

Основные компоненты:
- **PrismaService** - обертка над Prisma Client для работы с БД
- **TransactionInterceptor** - для автоматизации транзакций

### EnvironmentModule

Модуль для безопасного доступа к переменным окружения.

```typescript
// src/common/environment/environment.module.ts
@Module({
  providers: [EnvironmentService],
  exports: [EnvironmentService]
})
export class EnvironmentModule {}
```

**Особенности работы с EnvironmentService**:

Вместо прямого доступа к `process.env` или использования статических методов, инжектируйте EnvironmentService:

```typescript
@Injectable()
class AppService {
  constructor(private readonly environment: EnvironmentService) {}
  
  getConfiguration() {
    const port = this.environment.getPort();
    const dbUrl = this.environment.getString('DATABASE_URL');
    // ...
  }
}
```

Основные компоненты:
- **EnvironmentService** - типизированный доступ к env-переменным
- **EnvironmentValidator** - валидация переменных окружения

### LoggerModule

Настройка централизованного логгирования через Winston.

```typescript
// src/common/logger/logger.module.ts
@Module({
  providers: [LoggerService],
  exports: [LoggerService]
})
export class LoggerModule {}
```

Основные компоненты:
- **LoggerService** - обертка над Winston
- **RequestLoggerInterceptor** - логирование HTTP запросов

### SecurityModule

Модуль для всех аспектов безопасности (кроме аутентификации).

```typescript
// src/common/security/security.module.ts
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  exports: []
})
export class SecurityModule {}
```

Основные компоненты:
- **ThrottlerGuard** - защита от DDoS
- **CsrfMiddleware** - защита от CSRF
- **ContentSecurityPolicyInterceptor** - настройка CSP

## Бизнес-модули

Бизнес-модули сосредоточены на конкретной функциональности и используют общую инфраструктуру. Типичная структура модуля в текущей реализации:

```
modules/feature/
├── feature.module.ts        # Определение модуля
├── feature.controller.ts    # Контроллер с REST API
├── feature.service.ts       # Бизнес-логика
├── dto/                     # Data Transfer Objects
│   ├── create-feature.dto.ts
│   ├── update-feature.dto.ts
│   └── ...
└── feature.controller.spec.ts  # Тесты контроллера
└── feature.service.spec.ts     # Тесты сервиса
```

> **Примечание:** Схемы данных определены в `/prisma/schema.prisma` и не дублируются в виде entity-классов внутри модулей. Типы генерируются автоматически с помощью Prisma.

### Использование DTO и валидации

В проекте активно используются Data Transfer Objects (DTO) для валидации входных данных:

```typescript
// create-user.dto.ts
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

// users.controller.ts
@Post()
async create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

Это обеспечивает:
- Типобезопасность входных данных
- Автоматическую валидацию с помощью class-validator
- Отделение логики валидации от бизнес-логики
- Автоматическую документацию в Swagger

### Централизованная обработка ошибок

Вместо обработки исключений в каждом контроллере, используется глобальный фильтр:

```typescript
// common/filters/http-exception.filter.ts
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // Централизованная обработка ошибок
  }
}

// app.module.ts
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {}
```

Это позволяет:
- Унифицировать формат ответов с ошибками
- Централизованно логировать ошибки
- Упростить код контроллеров

### UsersModule

Управление пользователями системы.

```typescript
// src/modules/users/users.module.ts
@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
```

Структура модуля:
```
modules/users/
├── users.module.ts
├── users.controller.ts
├── users.service.ts
├── dto/
│   ├── create-user.dto.ts
│   └── update-user.dto.ts
├── users.controller.spec.ts
└── users.service.spec.ts
```

### AuthModule

Аутентификация и авторизация.

```typescript
// src/modules/auth/auth.module.ts
@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: (env: EnvironmentService) => ({
        secret: env.getJwtSecret(),
        signOptions: { expiresIn: env.getJwtExpires() }
      })
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy
  ],
  exports: [AuthService]
})
export class AuthModule {}
```

#### Защита маршрутов с RBAC

Для защиты маршрутов используется комбинация гвардов и декораторов:

```typescript
// users.controller.ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get()
async findAll() {
  return this.usersService.findAll();
}
```

Это обеспечивает:
- Проверку аутентификации через JWT
- Проверку ролей и прав доступа
- Декларативный подход к безопасности

Структура модуля:
```
modules/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   └── local-auth.guard.ts
├── strategies/
│   ├── jwt.strategy.ts
│   └── local.strategy.ts
├── auth.service.spec.ts
└── auth.controller.spec.ts
```

### ProjectsModule

Управление проектами.

```typescript
// src/modules/projects/projects.module.ts
@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService]
})
export class ProjectsModule {}
```

### HealthModule

Проверка работоспособности API и компонентов.

```typescript
// src/modules/health/health.module.ts
@Module({
  imports: [
    TerminusModule,
    DatabaseModule
  ],
  controllers: [HealthController],
  providers: []
})
export class HealthModule {}
```

## Связывание модулей

Все модули связываются через корневой AppModule:

```typescript
// src/app.module.ts
@Module({
  imports: [
    // Инфраструктурные модули
    DatabaseModule,
    EnvironmentModule,
    LoggerModule,
    SecurityModule,
    
    // Бизнес-модули
    AuthModule,
    UsersModule,
    ProjectsModule,
    HealthModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {}
