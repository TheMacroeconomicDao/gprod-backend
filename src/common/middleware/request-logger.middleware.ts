import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WinstonLogger } from '../logger/winston.logger';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new WinstonLogger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    // Генерируем уникальный идентификатор запроса
    const requestId = uuidv4();
    (request as any)['requestId'] = requestId;
    
    // Замеряем время запроса
    const startTime = process.hrtime();
    
    // Логируем начало запроса
    this.logger.debug(
      `Request started ${request.method} ${request.originalUrl}`,
      'RequestLogger',
      {
        requestId,
        method: request.method,
        url: request.originalUrl,
        ip: request.ip,
        headers: {
          'user-agent': request.get('user-agent'),
          'content-type': request.get('content-type'),
          'content-length': request.get('content-length'),
        },
      }
    );
    
    // Обработчик завершения запроса
    response.on('finish', () => {
      const duration = process.hrtime(startTime);
      const durationMs = Math.round(duration[0] * 1000 + duration[1] / 1e6);
      
      const userId = request.user ? (request.user as any).userId || (request.user as any).sub : undefined;
      const userContext = userId ? { userId } : {};
      
      // Определяем уровень логирования в зависимости от статуса
      const statusCode = response.statusCode;
      const logMethod = statusCode >= 500 
        ? 'error' 
        : statusCode >= 400 
          ? 'warn' 
          : 'debug';
      
      // Логируем результат запроса
      this.logger[logMethod](
        `Request completed ${request.method} ${request.originalUrl} ${statusCode} ${durationMs}ms`,
        'RequestLogger',
        {
          requestId,
          method: request.method,
          url: request.originalUrl,
          statusCode,
          durationMs,
          contentLength: response.get('content-length'),
          ...userContext,
        }
      );
    });
    
    next();
  }
} 