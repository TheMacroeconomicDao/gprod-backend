import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * Сервис для централизованной работы с безопасностью
 */
@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);
  
  constructor(private readonly jwtService: JwtService) {}
  
  /**
   * Генерирует JWT токен для пользователя
   */
  generateToken(payload: Record<string, any>, expiresIn: string = '1h'): string {
    try {
      return this.jwtService.sign(payload, { expiresIn });
    } catch (error) {
      this.logger.error(`Failed to generate token: ${error.message}`, error.stack);
      throw error;
    }
  }
  
  /**
   * Верифицирует JWT токен
   * @returns Декодированный payload токена
   */
  verifyToken(token: string): Record<string, any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      this.logger.error(`Failed to verify token: ${error.message}`, error.stack);
      throw error;
    }
  }
  
  /**
   * Хэширует пароль (заглушка, должна использовать библиотеку argon2)
   */
  async hashPassword(password: string): Promise<string> {
    // В реальной реализации здесь должен быть код для хэширования через argon2
    throw new Error('Not implemented');
  }
  
  /**
   * Проверяет пароль (заглушка, должна использовать библиотеку argon2)
   */
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    // В реальной реализации здесь должен быть код для проверки через argon2
    throw new Error('Not implemented');
  }
} 