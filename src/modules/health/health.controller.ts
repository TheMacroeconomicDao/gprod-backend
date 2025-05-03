import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.module';
import { RateLimit } from '../../common/decorators/rate-limit.decorator';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @RateLimit(5, 60)
  @Get()
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', db: 'ok' };
    } catch (e) {
      return { status: 'error', db: 'fail', error: e.message };
    }
  }
} 