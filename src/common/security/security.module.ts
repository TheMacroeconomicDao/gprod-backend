import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { RolesGuard } from './guards/roles.guard';
import { SecurityService } from './security.service';

/**
 * Модуль для централизованного управления безопасностью приложения
 * Включает Guards, Middleware и интерцепторы безопасности
 */
@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-jwt-secret',
      signOptions: { 
        expiresIn: process.env.JWT_EXPIRES || '1h' 
      },
    }),
  ],
  providers: [
    SecurityService,
    { provide: APP_GUARD, useClass: RateLimitGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [SecurityService, JwtModule],
})
export class SecurityModule {} 