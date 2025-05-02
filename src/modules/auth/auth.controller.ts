import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request as ExpressRequest } from 'express';
import { ApiBody, ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiExtraModels, ApiInternalServerErrorResponse, ApiConflictResponse } from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../../common/dto/api-error-response.dto';

class LoginDto {
  username: string;
  password: string;
}

@ApiTags('auth')
@ApiExtraModels(ApiErrorResponseDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация пользователя (лимит 5 req/min)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Пользователь зарегистрирован', schema: { example: { id: 1, username: 'john_doe', email: 'john@example.com', isActive: true, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } } })
  @ApiBadRequestResponse({ description: 'Валидационная ошибка', type: ApiErrorResponseDto })
  @ApiConflictResponse({ description: 'Пользователь уже существует', type: ApiErrorResponseDto, schema: { example: { statusCode: 409, message: 'User already exists', error: 'Conflict' } } })
  @ApiInternalServerErrorResponse({ description: 'Внутренняя ошибка', type: ApiErrorResponseDto })
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Логин пользователя (ручной, лимит 10 req/min)' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'JWT токен', schema: { example: { access_token: 'jwt.token.here' } } })
  @ApiUnauthorizedResponse({ description: 'Неверные креды', type: ApiErrorResponseDto, schema: { example: { statusCode: 401, message: 'Invalid credentials', error: 'Unauthorized' } } })
  @ApiInternalServerErrorResponse({ description: 'Внутренняя ошибка', type: ApiErrorResponseDto })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }

  @ApiOperation({ summary: 'Логин пользователя (через Guard, лимит 10 req/min)' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'JWT токен', schema: { example: { access_token: 'jwt.token.here' } } })
  @ApiUnauthorizedResponse({ description: 'Неверные креды', type: ApiErrorResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Внутренняя ошибка', type: ApiErrorResponseDto })
  @UseGuards(LocalAuthGuard)
  @Post('login-guard')
  loginGuard(@Request() req: ExpressRequest) {
    const user = req.user as { username: string } | undefined;
    if (!user || !user.username) throw new Error('No user in request');
    return this.authService.login(user.username, req.body.password);
  }
}
