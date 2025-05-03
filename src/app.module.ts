import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './common/prisma.module';
import { RateLimitGuard } from './common/guards/rate-limit.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [PrismaModule, UsersModule, ProjectsModule, AuthModule, HealthModule],
  controllers: [AppController],
  providers: [
    AppService, 
    { provide: APP_GUARD, useClass: RateLimitGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
