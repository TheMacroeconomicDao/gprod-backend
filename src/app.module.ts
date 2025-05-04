import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Модули приложения
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';

// Общие компоненты
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { EnvHelper } from './common/helpers/env.helper';

// Импортируем модули через единую точку входа
import { 
  DatabaseModule, 
  EnvironmentModule,
  SecurityModule,
  LoggerModule,
  ConfigModule
} from './common';

@Module({
  imports: [
    // Инфраструктурные модули
    ConfigModule,
    EnvironmentModule,
    LoggerModule,
    SecurityModule,
    // Модули данных подключаем только если не тестируем логгер
    ...(EnvHelper.get('LOGGER_TEST_MODE', 'false') === 'true' 
      ? [] 
      : [
          DatabaseModule,
          UsersModule,
          ProjectsModule,
          AuthModule,
        ]),
    // Всегда подключаем модуль проверки здоровья системы
    HealthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Применяем middleware для логирования запросов ко всем маршрутам
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
