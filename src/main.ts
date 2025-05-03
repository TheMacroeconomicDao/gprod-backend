import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { EnvHelper } from './common/helpers/env.helper';
import { WinstonLogger } from './common/logger/winston.logger';
import * as express from 'express';
import helmet from 'helmet';

async function checkSchema() {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRawUnsafe('SELECT roles FROM "User" LIMIT 1');
  } catch (e) {
    // Логируем и падаем, если нет поля
    // eslint-disable-next-line no-console
    console.error('FATAL: "roles" column missing in "User" table. Run migrations!');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Bootstrap function for starting the NestJS application
async function bootstrap() {
  // WinstonLogger for structured logging (info, error, etc.)
  const logger = new WinstonLogger();
  try {
    // Проверяем схему до старта приложения
    await checkSchema();
    // Создаём приложение с кастомным логгером
    const app = await NestFactory.create(AppModule, { logger });

    // Включаем helmet с явной настройкой Content Security Policy (CSP)
    // Это защищает от XSS и других атак, явно указывая разрешённые источники
    app.use(
      helmet({
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            "default-src": ["'self'"],
            "img-src": ["'self'", 'data:', 'https:'],
            "script-src": ["'self'", 'https:'],
            "style-src": ["'self'", 'https:', "'unsafe-inline'"],
            // Добавь свои домены если нужно
          },
        },
      })
    );

    // Включаем CORS с origin из ENV (CORS_ORIGIN=...)
    // Это позволяет гибко управлять разрешёнными доменами для фронта
    app.enableCors({
      origin: EnvHelper.array('CORS_ORIGIN', [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://your-prod-domain.com',
      ]),
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    });

    // Глобальные пайпы для валидации DTO (class-validator)
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    // Глобальный фильтр для обработки ошибок (кастомный формат)
    app.useGlobalFilters(new HttpExceptionFilter());
    // Ограничение размера body (1MB)
    app.use(express.json({ limit: '1mb' }));

    // Глобальный префикс для всех роутов: /api/v1
    // Все эндпоинты будут по /api/v1/...
    app.setGlobalPrefix('api/v1');

    // Swagger v1: документация для основной версии API
    const v1Config = new DocumentBuilder()
      .setTitle('GPROD API v1')
      .setDescription('REST API for users, auth, projects (v1)')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const v1Document = SwaggerModule.createDocument(app, v1Config);
    SwaggerModule.setup('api/v1/docs', app, v1Document);

    // Swagger v2: документация для будущей версии API (пример)
    // Контроллеры для v2 можно добавить в include
    const v2Config = new DocumentBuilder()
      .setTitle('GPROD API v2')
      .setDescription('REST API for users, auth, projects (v2)')
      .setVersion('2.0')
      .addBearerAuth()
      .build();
    const v2Document = SwaggerModule.createDocument(app, v2Config, {
      include: [], // сюда добавь контроллеры v2, если появятся
    });
    SwaggerModule.setup('api/v2/docs', app, v2Document);

    // Запуск приложения на порту из ENV (по умолчанию 3007)
    await app.listen(EnvHelper.int('PORT', 3007));
  } catch (err) {
    // Логируем фатальные ошибки старта через WinstonLogger
    logger.error('Fatal error during bootstrap', err.stack || err);
    process.exit(1);
  }
}
// Запуск bootstrap
bootstrap();
