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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const projects_service_1 = require("./projects.service");
const create_project_dto_1 = require("./dto/create-project.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const api_error_response_dto_1 = require("../../common/dto/api-error-response.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let ProjectsController = class ProjectsController {
    projectsService;
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    create(createProjectDto) {
        return this.projectsService.create(createProjectDto);
    }
    findAll(page = 1, limit = 20, search, sort) {
        return this.projectsService.findAll(Number(page), Number(limit));
    }
    findOne(id) {
        return this.projectsService.findOne(+id);
    }
    update(id, updateProjectDto) {
        return this.projectsService.update(+id, updateProjectDto);
    }
    remove(id) {
        return this.projectsService.remove(+id);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Создать проект (требуется JWT, лимит 10 req/min, роль: user/admin)' }),
    (0, swagger_1.ApiBody)({ type: create_project_dto_1.CreateProjectDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Проект создан', schema: { example: { id: 1, title: 'My Project', description: 'Описание', ownerId: 1, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } } }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Валидационная ошибка', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Нет JWT', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Нет прав', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Внутренняя ошибка', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_dto_1.CreateProjectDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получить список проектов (JWT, пагинация, поиск, сортировка, лимит 30 req/min, роль: user/admin)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, example: 'my', description: 'Поиск по названию/описанию' }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, example: 'createdAt:desc', description: 'Сортировка, например: createdAt:desc' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список проектов', schema: { example: { data: [{ id: 1, title: 'My Project', description: 'Описание', ownerId: 1, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' }], total: 1 } } }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Нет JWT', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Нет прав', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Внутренняя ошибка', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получить проект по id (JWT, роль: user/admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Проект найден', schema: { example: { id: 1, title: 'My Project', description: 'Описание', ownerId: 1, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } } }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Проект не найден', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Нет JWT', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Нет прав', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Внутренняя ошибка', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Обновить проект (JWT, роль: user/admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    (0, swagger_1.ApiBody)({ type: update_project_dto_1.UpdateProjectDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Проект обновлён', schema: { example: { id: 1, title: 'New Title', description: 'Новое описание', ownerId: 1, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-02T00:00:00.000Z' } } }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Валидационная ошибка', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Проект не найден', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Нет JWT', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Нет прав', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Внутренняя ошибка', type: api_error_response_dto_1.ApiErrorResponseDto }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "remove", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, swagger_1.ApiTags)('projects'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiExtraModels)(api_error_response_dto_1.ApiErrorResponseDto),
    (0, common_1.Controller)('projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map