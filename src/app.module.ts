import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './common/prisma.module';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { RateLimiterMiddleware } from './common/middleware/rate-limiter.middleware';
import { RateLimitInterceptor } from './common/interceptors/rate-limit.interceptor';
import { LoggerModule } from './common/logger/logger.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimitInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware, RateLimiterMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
