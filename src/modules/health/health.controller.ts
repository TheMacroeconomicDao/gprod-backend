import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.module';
import { RateLimit } from '../../common/decorators/rate-limit.decorator';
import { WinstonLogger } from '../../common/logger/winston.logger';
import { EnvHelper } from '../../common/helpers/env.helper';

@Controller('health')
export class HealthController {
  private readonly logger = new WinstonLogger('HealthController');
  
  constructor(private readonly prisma?: PrismaService) {}

  @RateLimit(5, 60)
  @Get()
  async check() {
    this.logger.log('Health check запрошен');
    
    // Если мы в режиме тестирования логгера, возвращаем фиктивный ответ
    if (EnvHelper.get('LOGGER_TEST_MODE', 'false') === 'true') {
      this.logger.debug('Health check выполнен без проверки базы данных (режим тестирования логгера)');
      return { status: 'ok', db: 'not_checked', message: 'Режим тестирования логгера' };
    }
    
    // Обычный режим с проверкой базы данных
    try {
      // Проверяем, что prisma инициализирован
      if (!this.prisma) {
        throw new Error('PrismaService не инициализирован');
      }
      
      // Проверяем доступность базы данных
      await this.prisma.$queryRaw`SELECT 1`;
      this.logger.debug('Health check выполнен успешно');
      return { status: 'ok', db: 'ok' };
    } catch (e) {
      this.logger.error('Health check завершился с ошибкой', e.stack);
      return { status: 'error', db: 'fail', error: e.message };
    }
  }
} 