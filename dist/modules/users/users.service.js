"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    prisma = new client_1.PrismaClient();
    async create(createUserDto) {
        return this.prisma.user.create({ data: createUserDto });
    }
    async findAll(page = 1, limit = 20, search, sort) {
        const where = { isActive: true };
        if (search) {
            where.OR = [
                { username: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
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
            this.prisma.user.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where,
                orderBy,
            }),
            this.prisma.user.count({ where }),
        ]);
        return { data, total };
    }
    async findOne(id) {
        const user = await this.prisma.user.findFirst({ where: { id, isActive: true } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async update(id, updateUserDto) {
        await this.findOne(id);
        return this.prisma.user.update({ where: { id }, data: updateUserDto });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.user.update({ where: { id }, data: { isActive: false } });
        return { success: true };
    }
    async findByUsername(username) {
        return this.prisma.user.findUnique({ where: { username } });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map