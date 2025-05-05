import { Module, Global } from '@nestjs/common';
import { EnvironmentService } from './environment.service';

/**
 * Глобальный модуль для работы с переменными окружения
 * Предоставляет доступ к конфигурации через DI
 */
@Global()
@Module({
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {} 