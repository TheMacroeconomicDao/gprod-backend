import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimitType, RateLimitOptions } from '../decorators/rate-limit.decorator';
import { ConfigService } from '@nestjs/config';
import { Logger } from '../logger/logger.service';

interface RateLimitRecord {
  count: number;
  lastRequest: Date;
  blockedUntil: Date | null;
  violations: number;
}

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly ipLimits: Map<string, Record<string, RateLimitRecord>> = new Map();
  private readonly cleanupInterval: NodeJS.Timeout;
  private readonly logger: Logger = new Logger('RateLimiter');

  constructor(private readonly configService: ConfigService) {
    // Запускаем регулярную очистку устаревших записей
    this.cleanupInterval = setInterval(() => this.cleanup(), 10 * 60 * 1000); // каждые 10 минут
  }

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.connection.remoteAddress;
    
    if (!ip) {
      this.logger.warn('Cannot determine client IP address');
      return next();
    }

    // Получаем тип запроса из метаданных (будет установлено в RateLimitInterceptor)
    let rateLimitOptions: RateLimitOptions = req['rateLimitOptions'];
    
    // Если метаданных нет, используем значения по умолчанию
    if (!rateLimitOptions) {
      rateLimitOptions = {
        limit: this.configService.get<number>('RATE_LIMIT_DEFAULT', 60),
        ttlSeconds: this.configService.get<number>('RATE_LIMIT_TTL', 60),
        type: RateLimitType.DEFAULT,
        blockMultiplier: 2,
        weight: 1,
      };
    }
    
    // Получаем или создаем запись для IP
    if (!this.ipLimits.has(ip)) {
      this.ipLimits.set(ip, {});
    }
    
    const ipRecords = this.ipLimits.get(ip);
    const rateType = rateLimitOptions.type;
    
    // Если нет записи для данного типа запроса, создаем
    if (!ipRecords[rateType]) {
      ipRecords[rateType] = {
        count: 0,
        lastRequest: new Date(),
        blockedUntil: null,
        violations: 0,
      };
    }
    
    const record = ipRecords[rateType];
    const now = new Date();
    
    // Проверяем, не заблокирован ли IP
    if (record.blockedUntil && now < record.blockedUntil) {
      const remainingTime = Math.ceil((record.blockedUntil.getTime() - now.getTime()) / 1000);
      
      // Логируем попытку запроса во время блокировки
      this.logger.warn(`Rate limit violation: ${ip} is blocked for ${remainingTime}s more`);
      
      // Увеличиваем время блокировки при попытке обхода
      record.violations += 1;
      if (record.violations > 3) {
        // Прогрессивно увеличиваем время блокировки
        const additionalBlock = record.violations * 10; // +10 секунд за каждое нарушение
        record.blockedUntil = new Date(record.blockedUntil.getTime() + additionalBlock * 1000);
        
        this.logger.warn(`Increased block time for ${ip} by ${additionalBlock}s due to repeated violations`);
      }
      
      // Возвращаем 429 Too Many Requests с указанием оставшегося времени блокировки
      res.setHeader('Retry-After', remainingTime.toString());
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Too many requests. Try again in ${remainingTime} seconds.`,
          error: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    
    // Проверяем, не истек ли период сброса лимита
    const timeSinceLastRequest = (now.getTime() - record.lastRequest.getTime()) / 1000;
    if (timeSinceLastRequest > rateLimitOptions.ttlSeconds) {
      // Сбрасываем счетчик, если период истек
      record.count = 0;
      record.violations = Math.max(0, record.violations - 1); // Уменьшаем счетчик нарушений
    }
    
    // Увеличиваем счетчик запросов
    record.count += rateLimitOptions.weight;
    record.lastRequest = now;
    
    // Проверяем, не превышен ли лимит
    if (record.count > rateLimitOptions.limit) {
      record.violations += 1;
      
      // Рассчитываем время блокировки с учетом множителя и количества нарушений
      const blockTime = Math.min(
        600, // Максимальное время блокировки - 10 минут
        rateLimitOptions.ttlSeconds * 
        rateLimitOptions.blockMultiplier * 
        Math.pow(1.5, Math.min(5, record.violations - 1)) // Экспоненциальный рост до 5 нарушений
      );
      
      // Устанавливаем время до которого IP заблокирован
      record.blockedUntil = new Date(now.getTime() + blockTime * 1000);
      
      this.logger.warn(`Rate limit exceeded: ${ip} blocked for ${blockTime}s (violations: ${record.violations})`);
      
      // Возвращаем 429 Too Many Requests с указанием оставшегося времени блокировки
      res.setHeader('Retry-After', Math.ceil(blockTime).toString());
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Too many requests. Try again in ${Math.ceil(blockTime)} seconds.`,
          error: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    
    // Устанавливаем заголовки с информацией о лимитах
    res.setHeader('X-RateLimit-Limit', rateLimitOptions.limit.toString());
    res.setHeader('X-RateLimit-Remaining', (rateLimitOptions.limit - record.count).toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(rateLimitOptions.ttlSeconds - timeSinceLastRequest).toString());
    
    next();
  }

  // Очистка устаревших записей
  private cleanup() {
    const now = new Date();
    const cleanupCount = { ips: 0, records: 0 };
    
    this.ipLimits.forEach((records, ip) => {
      let allExpired = true;
      let recordsRemoved = 0;
      
      Object.keys(records).forEach(type => {
        const record = records[type];
        const timeSinceLastRequest = (now.getTime() - record.lastRequest.getTime()) / 1000;
        
        // Удаляем записи старше 1 часа и без активной блокировки
        if (timeSinceLastRequest > 3600 && (!record.blockedUntil || now > record.blockedUntil)) {
          delete records[type];
          recordsRemoved++;
        } else {
          allExpired = false;
        }
      });
      
      // Если все записи для IP удалены, удаляем сам IP
      if (allExpired) {
        this.ipLimits.delete(ip);
        cleanupCount.ips++;
      }
      
      cleanupCount.records += recordsRemoved;
    });
    
    if (cleanupCount.ips > 0 || cleanupCount.records > 0) {
      this.logger.debug(`Cleanup: removed ${cleanupCount.records} records for ${cleanupCount.ips} IPs`);
    }
  }
  
  // Очистка при завершении работы
  onModuleDestroy() {
    clearInterval(this.cleanupInterval);
  }
} 