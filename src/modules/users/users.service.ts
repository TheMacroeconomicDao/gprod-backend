import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.module';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    console.log('[UsersService.create] dto:', createUserDto);
    try {
      return await this.prisma.user.create({ data: createUserDto });
    } catch (err) {
      console.error('[UsersService.create] error:', err);
      throw err;
    }
  }

  async findAll(page = 1, limit = 20, search?: string, sort?: string) {
    console.log(
      '[UsersService.findAll] page:',
      page,
      'limit:',
      limit,
      'search:',
      search,
      'sort:',
      sort,
    );
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
    try {
      const [data, total] = await Promise.all([
        this.prisma.user.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where,
          orderBy,
        }),
        this.prisma.user.count({ where }),
      ]);
      console.log(
        '[UsersService.findAll] found:',
        data.length,
        'total:',
        total,
      );
      return { data, total };
    } catch (err) {
      console.error('[UsersService.findAll] error:', err);
      throw err;
    }
  }

  async findOne(id: number) {
    console.log('[UsersService.findOne] id:', id);
    try {
      const user = await this.prisma.user.findFirst({
        where: { id, isActive: true },
      });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (err) {
      console.error('[UsersService.findOne] error:', err);
      throw err;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    console.log('[UsersService.update] id:', id, 'dto:', updateUserDto);
    try {
      await this.findOne(id);

      // Если обновляется пароль, отзываем все токены
      if (updateUserDto.password) {
        // Хешируем пароль
        updateUserDto.password = await argon2.hash(updateUserDto.password);

        // Отзываем все токены пользователя при смене пароля
        await this.prisma.refreshToken.deleteMany({ where: { userId: id } });
      }

      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (err) {
      console.error('[UsersService.update] error:', err);
      throw err;
    }
  }

  async remove(id: number) {
    console.log('[UsersService.remove] id:', id);
    try {
      await this.findOne(id);
      await this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      });
      return { success: true };
    } catch (err) {
      console.error('[UsersService.remove] error:', err);
      throw err;
    }
  }

  async findByUsername(username: string) {
    console.log('[UsersService.findByUsername] username:', username);
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findByEmail(email: string) {
    console.log('[UsersService.findByEmail] email:', email);
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updatePassword(id: number, newPassword: string) {
    console.log('[UsersService.updatePassword] id:', id);
    try {
      // Проверяем существование пользователя
      await this.findOne(id);

      // Хешируем новый пароль
      const hashedPassword = await argon2.hash(newPassword);

      // Используем транзакцию для атомарного обновления пароля и удаления токенов
      return await this.prisma.$transaction(async (tx) => {
        // Отзываем все токены пользователя
        await tx.refreshToken.deleteMany({ where: { userId: id } });

        // Обновляем пароль
        return tx.user.update({
          where: { id },
          data: { password: hashedPassword },
        });
      });
    } catch (err) {
      console.error('[UsersService.updatePassword] error:', err);
      throw err;
    }
  }
}
