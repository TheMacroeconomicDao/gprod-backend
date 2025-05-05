# Работа с EnvironmentService

## Обзор

`EnvironmentService` - это специальный сервис для безопасного, типизированного доступа к переменным окружения в приложении. Он заменяет прямое использование `process.env` и предоставляет дополнительные возможности:

- Типизированное получение значений (строки, числа, булевы значения)
- Проверка наличия обязательных переменных
- Значения по умолчанию
- Кэширование для улучшения производительности
- Контекстно-зависимые переменные в зависимости от текущего окружения

## Использование EnvironmentService

### Внедрение в классы (рекомендуемый способ)

```typescript
import { Injectable } from '@nestjs/common';
import { EnvironmentService } from 'src/common/environment/environment.service';

@Injectable()
export class AppService {
  constructor(private readonly environment: EnvironmentService) {}
  
  getConfiguration() {
    // Получение строкового значения с проверкой обязательности
    const dbUrl = this.environment.getString('DATABASE_URL', undefined, true);
    
    // Получение числа со значением по умолчанию
    const port = this.environment.getNumber('PORT', 3000);
    
    // Получение булева значения
    const isDebug = this.environment.getBoolean('DEBUG', false);
    
    // Получение массива строк
    const corsOrigins = this.environment.getArray('CORS_ORIGIN', ['localhost']);
    
    // Проверка текущего окружения
    if (this.environment.isProduction()) {
      // Логика для продакшн-окружения
    }
    
    return {
      dbUrl,
      port,
      isDebug,
      corsOrigins,
      currentEnv: this.environment.getCurrentEnvironment()
    };
  }
}
```

### Методы EnvironmentService

| Метод | Описание | Пример |
|-------|----------|--------|
| `getString(key, defaultValue?, required?)` | Получение строкового значения | `env.getString('API_KEY', undefined, true)` |
| `getNumber(key, defaultValue?)` | Получение числового значения | `env.getNumber('PORT', 3000)` |
| `getBoolean(key, defaultValue?)` | Получение булева значения | `env.getBoolean('DEBUG', false)` |
| `getArray(key, defaultValue?)` | Получение массива строк | `env.getArray('ALLOWED_ORIGINS', ['localhost'])` |
| `getJson(key, defaultValue?)` | Получение и парсинг JSON | `env.getJson('CONFIG', { enabled: false })` |
| `getPort()` | Получение порта приложения | `env.getPort()` |
| `getJwtSecret()` | Получение JWT-секрета | `env.getJwtSecret()` |
| `getCurrentEnvironment()` | Текущее окружение | `env.getCurrentEnvironment()` |
| `isDevelopment()` | Проверка на dev-окружение | `if (env.isDevelopment()) { ... }` |
| `isStaging()` | Проверка на staging-окружение | `if (env.isStaging()) { ... }` |
| `isProduction()` | Проверка на production-окружение | `if (env.isProduction()) { ... }` |
| `isTest()` | Проверка на test-окружение | `if (env.isTest()) { ... }` |

## Преимущества перед прямым использованием process.env

### ❌ Было: Прямой доступ к process.env

```typescript
function bootstrap() {
  const port = parseInt(process.env.PORT || '3000', 10);
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    throw new Error('DATABASE_URL is required');
  }
  
  const isDebug = process.env.DEBUG === 'true';
  
  // ...
}
```

### ✅ Стало: Использование EnvironmentService

```typescript
@Injectable()
class AppService {
  constructor(private readonly environment: EnvironmentService) {}
  
  getConfiguration() {
    const port = this.environment.getNumber('PORT', 3000);
    const dbUrl = this.environment.getString('DATABASE_URL', undefined, true);
    const isDebug = this.environment.getBoolean('DEBUG', false);
    
    // ...
  }
}
```

## Преимущества EnvironmentService

1. **Типобезопасность** - автоматическое приведение к нужному типу данных
2. **Проверка обязательных переменных** - раннее обнаружение ошибок конфигурации
3. **DI-подход** - возможность мокать для тестирования
4. **Кэширование** - повышение производительности
5. **Контекстная логика** - разная логика для разных окружений

## Интеграция с NestJS ConfigModule

`EnvironmentService` может работать совместно с `@nestjs/config` для более комплексных конфигураций:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentModule } from './common/environment/environment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    EnvironmentModule,
    // другие модули
  ],
})
export class AppModule {}
```

## Лучшие практики

1. **Всегда используйте инжекцию** EnvironmentService вместо статических вызовов
2. **Указывайте значения по умолчанию** для некритичных параметров
3. **Устанавливайте required=true** для критически важных переменных
4. **Группируйте переменные окружения** по функциональным блокам
5. **Создавайте хелпер-методы** для часто используемых переменных
6. **Тестируйте работу с разными конфигурациями** окружения
