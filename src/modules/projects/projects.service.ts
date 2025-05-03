import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.module';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    console.log('[ProjectsService.create] dto:', createProjectDto);
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
    console.log('[ProjectsService.findAll] page:', page, 'limit:', limit, 'search:', search, 'sort:', sort);
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
    console.log('[ProjectsService.findAll] found:', data.length, 'total:', total);
    return { data, total };
  }

  async findOne(id: number) {
    console.log('[ProjectsService.findOne] id:', id);
    const project = await this.prisma.project.findUnique({ where: { id }, include: { owner: true } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    console.log('[ProjectsService.update] id:', id, 'dto:', updateProjectDto);
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
    console.log('[ProjectsService.remove] id:', id);
    try {
      // Сначала проверяем существование проекта
      await this.findOne(id);
      // Удаляем проект
      await this.prisma.project.delete({ where: { id } });
      console.log('[ProjectsService.remove] project deleted successfully, id:', id);
      return { success: true };
    } catch (err) {
      console.error('[ProjectsService.remove] error:', err);
      throw err;
    }
  }
}
