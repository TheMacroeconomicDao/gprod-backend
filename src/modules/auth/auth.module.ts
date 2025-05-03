import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { EnvHelper } from '../../common/helpers/env.helper';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: EnvHelper.get('JWT_SECRET'),
      signOptions: { expiresIn: EnvHelper.get('JWT_EXPIRES', '3600s') },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, LocalAuthGuard],
  exports: [JwtModule],
})
export class AuthModule {}
