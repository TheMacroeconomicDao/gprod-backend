import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { EnvHelper } from './common/helpers/env.helper';
import { WinstonLogger } from './common/logger/winston.logger';
import * as express from 'express';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new WinstonLogger() });
  app.use(helmet());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://your-prod-domain.com',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(express.json({ limit: '1mb' }));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.setGlobalPrefix('api');

  // v1 Swagger
  const v1Config = new DocumentBuilder()
    .setTitle('GPROD API v1')
    .setDescription('REST API for users, auth, projects (v1)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const v1Document = SwaggerModule.createDocument(app, v1Config);
  SwaggerModule.setup('api/v1/docs', app, v1Document);

  // v2 Swagger
  const v2Config = new DocumentBuilder()
    .setTitle('GPROD API v2')
    .setDescription('REST API for users, auth, projects (v2)')
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  const v2Document = SwaggerModule.createDocument(app, v2Config);
  SwaggerModule.setup('api/v2/docs', app, v2Document);

  await app.listen(EnvHelper.int('PORT', 3007));
}
bootstrap();
