import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { EnvHelper } from './common/helpers/env.helper';
import rateLimit from 'express-rate-limit';
import { WinstonLogger } from './common/logger/winston.logger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new WinstonLogger() });
  app.setGlobalPrefix('api/v1');
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
  app.use(rateLimit({ windowMs: 60_000, max: 100 })); // 100 req/min на IP
  app.use(express.json({ limit: '1mb' }));

  const config = new DocumentBuilder()
    .setTitle('GProd API')
    .setDescription('REST API for users, auth, projects')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(EnvHelper.int('PORT', 3000));
}
bootstrap();
