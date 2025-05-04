import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './common/prisma.module';
import { RateLimitGuard } from './common/guards/rate-limit.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ConfigModule } from './common/config/config.module';
import { LoggerModule } from './common/logger/logger.module';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { EnvHelper } from './common/helpers/env.helper';

@Module({
  imports: [
    // Инфраструктурные модули
    ConfigModule,
    LoggerModule,
    // Модули данных подключаем только если не тестируем логгер
    ...(EnvHelper.get('LOGGER_TEST_MODE', 'false') === 'true' 
      ? [] 
      : [
          PrismaModule,
          UsersModule,
          ProjectsModule,
          AuthModule,
        ]),
    // Всегда подключаем модуль проверки здоровья системы
    HealthModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    { provide: APP_GUARD, useClass: RateLimitGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Применяем middleware для логирования запросов ко всем маршрутам
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
