import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

/**
 * Обертка над Prisma Client для управления подключением к БД
 * и обеспечения интеграции с жизненным циклом NestJS
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
      ],
    });
  }

  /**
   * Подключение к базе данных при инициализации модуля
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('Connecting to database...');
    await this.$connect();
    this.logger.log('Database connection established');

    // Опционально: добавление middleware для логирования запросов
    this.$use(async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();

      this.logger.debug(
        `${params.model}.${params.action} took ${after - before}ms`,
      );

      return result;
    });
  }

  /**
   * Отключение от базы данных при завершении работы модуля
   */
  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting from database...');
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  /**
   * Проверка здоровья соединения с базой данных
   * @returns true если соединение работает, иначе false
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return false;
    }
  }
}
