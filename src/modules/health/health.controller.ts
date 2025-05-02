import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.module';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

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