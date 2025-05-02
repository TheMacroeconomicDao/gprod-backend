import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.module';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  async findAll(page = 1, limit = 20, search?: string, sort?: string) {
    const where: any = { isActive: true };
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    let orderBy: any = { id: 'asc' };
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

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({ where: { id, isActive: true } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.user.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
