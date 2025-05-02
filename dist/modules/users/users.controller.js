"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const swagger_1 = require("@nestjs/swagger");
const api_error_response_dto_1 = require("../../common/dto/api-error-response.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(createUserDto, req) {
        if (createUserDto.roles && createUserDto.roles.some(r => r !== 'user')) {
            if (!req.user?.roles?.includes('admin')) {
                throw new common_1.ForbiddenException('Only admin can assign roles above user');
            }
        }
        return this.usersService.create(createUserDto);
    }
    findAll(page = 1, limit = 20, search, sort) {
        return this.usersService.findAll(Number(page), Number(limit), search, sort);
    }
    findOne(id) {
        return this.usersService.findOne(+id);
    }
    update(id, updateUserDto, req) {
        if (updateUserDto.roles && updateUserDto.roles.some(r => r !== 'user')) {
            if (!req.user?.roles?.includes('admin')) {
                throw new common_1.ForbiddenException('Only admin can assign roles above user');
            }
        }
        return this.usersService.update(+id, updateUserDto);
    }
    remove(id) {
        return this.usersService.remove(+id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Создать пользователя' }),
    (0, swagger_1.ApiBody)({ type: create_user_dto_1.CreateUserDto, description: 'Создать пользователя (можно указать roles, только admin может назначать роли выше user)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Пользователь создан', schema: { example: { id: 1, username: 'john_doe', email: 'john@example.com', isActive: true, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } } }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Валидационная ошибка', type: api_error_response_dto_1.ApiErrorResponseDto, schema: { example: { statusCode: 400, message: ['username must be unique'], error: 'Bad Request' } } }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Пользователь уже существует', type: api_error_response_dto_1.ApiErrorResponseDto, schema: { example: { statusCode: 409, message: 'User already exists', error: 'Conflict' } } }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Внутренняя ошибка', type: api_error_response_dto_1.ApiErrorResponseDto, schema: { example: { statusCode: 500, message: 'Internal server error', error: 'Internal Server Error' } } }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получить список пользователей (пагинация, поиск, сортировка)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, example: 'john', description: 'Поиск по username/email' }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, example: 'createdAt:desc', description: 'Сортировка, например: createdAt:desc' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список пользователей', schema: { example: { data: [{ id: 1, username: 'john_doe', email: 'john@example.com', isActive: true, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' }], total: 1 } } }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Внутренняя ошибка', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получить пользователя по id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Пользователь найден', schema: { example: { id: 1, username: 'john_doe', email: 'john@example.com', isActive: true, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } } }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Пользователь не найден', type: api_error_response_dto_1.ApiErrorResponseDto, schema: { example: { statusCode: 404, message: 'User not found', error: 'Not Found' } } }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Внутренняя ошибка', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Обновить пользователя' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    (0, swagger_1.ApiBody)({ type: update_user_dto_1.UpdateUserDto, description: 'Обновить пользователя (можно менять roles только admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Пользователь обновлён', schema: { example: { id: 1, username: 'new_username', email: 'new@email.com', isActive: true, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-02T00:00:00.000Z' } } }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Валидационная ошибка', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Пользователь не найден', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Внутренняя ошибка', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить пользователя' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Пользователь удалён', schema: { example: { success: true } } }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Пользователь не найден', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Внутренняя ошибка', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, swagger_1.ApiExtraModels)(api_error_response_dto_1.ApiErrorResponseDto),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map