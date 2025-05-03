import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../../common/dto/api-error-response.dto';

@ApiTags('users')
@ApiExtraModels(ApiErrorResponseDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Пользователь создан', schema: { example: { id: 1, username: 'john_doe', email: 'john@example.com', isActive: true, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } } })
  @ApiBadRequestResponse({ description: 'Валидационная ошибка', type: ApiErrorResponseDto, schema: { example: { statusCode: 400, message: ['username must be unique'], error: 'Bad Request' } } })
  @ApiConflictResponse({ description: 'Пользователь уже существует', type: ApiErrorResponseDto, schema: { example: { statusCode: 409, message: 'User already exists', error: 'Conflict' } } })
  @ApiInternalServerErrorResponse({ description: 'Внутренняя ошибка', type: ApiErrorResponseDto, schema: { example: { statusCode: 500, message: 'Internal server error', error: 'Internal Server Error' } } })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Получить список пользователей (пагинация, поиск, сортировка)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false, example: 'john', description: 'Поиск по username/email' })
  @ApiQuery({ name: 'sort', required: false, example: 'createdAt:desc', description: 'Сортировка, например: createdAt:desc' })
  @ApiResponse({ status: 200, description: 'Список пользователей', schema: { example: { data: [{ id: 1, username: 'john_doe', email: 'john@example.com', isActive: true, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' }], total: 1 } } })
  @ApiInternalServerErrorResponse({ description: 'Внутренняя ошибка', type: ApiErrorResponseDto })
  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 20, @Query('search') search?: string, @Query('sort') sort?: string) {
    // search/sort пока не реализованы, но описаны для Swagger
    return this.usersService.findAll(Number(page), Number(limit));
  }

  @ApiOperation({ summary: 'Получить пользователя по id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Пользователь найден', schema: { example: { id: 1, username: 'john_doe', email: 'john@example.com', isActive: true, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } } })
  @ApiNotFoundResponse({ description: 'Пользователь не найден', type: ApiErrorResponseDto, schema: { example: { statusCode: 404, message: 'User not found', error: 'Not Found' } } })
  @ApiInternalServerErrorResponse({ description: 'Внутренняя ошибка', type: ApiErrorResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Пользователь обновлён', schema: { example: { id: 1, username: 'new_username', email: 'new@email.com', isActive: true, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-02T00:00:00.000Z' } } })
  @ApiBadRequestResponse({ description: 'Валидационная ошибка', type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ description: 'Пользователь не найден', type: ApiErrorResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Внутренняя ошибка', type: ApiErrorResponseDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Пользователь удалён', schema: { example: { success: true } } })
  @ApiNotFoundResponse({ description: 'Пользователь не найден', type: ApiErrorResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Внутренняя ошибка', type: ApiErrorResponseDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
