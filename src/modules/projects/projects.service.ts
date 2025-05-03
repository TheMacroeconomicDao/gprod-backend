import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.module';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    const owner = await this.prisma.user.findUnique({ where: { id: createProjectDto.ownerId } });
    if (!owner) throw new NotFoundException('Owner not found');
    return this.prisma.project.create({
      data: {
        title: createProjectDto.title,
        description: createProjectDto.description,
        owner: { connect: { id: createProjectDto.ownerId } },
      },
      include: { owner: true },
    });
  }

  async findAll(page = 1, limit = 20, search?: string, sort?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
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

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({ where: { id }, include: { owner: true } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id);
    const data: any = { ...updateProjectDto };
    if (updateProjectDto.ownerId) {
      const owner = await this.prisma.user.findUnique({ where: { id: updateProjectDto.ownerId } });
      if (!owner) throw new NotFoundException('Owner not found');
      data.owner = { connect: { id: updateProjectDto.ownerId } };
    }
    return this.prisma.project.update({ where: { id }, data, include: { owner: true } });
  }

  async remove(id: number) {
    // Сначала обнуляем ownerId у всех проектов пользователя
    await this.prisma.project.updateMany({
      where: { ownerId: id },
      data: { ownerId: undefined },
    });
    // Теперь можно удалить пользователя
    return this.prisma.user.delete({ where: { id } });
  }
}
