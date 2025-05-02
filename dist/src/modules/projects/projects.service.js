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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../common/prisma.module");
let ProjectsService = class ProjectsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createProjectDto) {
        const owner = await this.prisma.user.findUnique({ where: { id: createProjectDto.ownerId } });
        if (!owner)
            throw new common_1.NotFoundException('Owner not found');
        return this.prisma.project.create({
            data: {
                title: createProjectDto.title,
                description: createProjectDto.description,
                owner: { connect: { id: createProjectDto.ownerId } },
            },
            include: { owner: true },
        });
    }
    async findAll(page = 1, limit = 20, search, sort) {
        const where = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        let orderBy = { id: 'asc' };
        if (sort) {
            const [field, dir] = sort.split(':');
            if (field && dir && ['asc', 'desc'].includes(dir)) {
                orderBy = { [field]: dir };
            }
        }
        const [data, total] = await Promise.all([
            this.prisma.project.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where,
                orderBy,
                include: { owner: true },
            }),
            this.prisma.project.count({ where }),
        ]);
        return { data, total };
    }
    async findOne(id) {
        const project = await this.prisma.project.findUnique({ where: { id }, include: { owner: true } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return project;
    }
    async update(id, updateProjectDto) {
        await this.findOne(id);
        const data = { ...updateProjectDto };
        if (updateProjectDto.ownerId) {
            const owner = await this.prisma.user.findUnique({ where: { id: updateProjectDto.ownerId } });
            if (!owner)
                throw new common_1.NotFoundException('Owner not found');
            data.owner = { connect: { id: updateProjectDto.ownerId } };
        }
        return this.prisma.project.update({ where: { id }, data, include: { owner: true } });
    }
    async remove(id) {
        await this.prisma.project.delete({ where: { id } });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_module_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map