import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { RolesGuard } from './guards/roles.guard';
import { SecurityService } from './security.service';

/**
 * Модуль для централизованного управления безопасностью приложения
 * Включает Guards, Middleware и интерцепторы безопасности
 */
@Global()
@Module({
  providers: [
    SecurityService,
    { provide: APP_GUARD, useClass: RateLimitGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [SecurityService],
})
export class SecurityModule {} 