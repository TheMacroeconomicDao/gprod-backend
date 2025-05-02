import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  private prisma = new PrismaClient();

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

  async findAll(page = 1, limit = 20) {
    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
        include: { owner: true },
      }),
      this.prisma.project.count(),
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
    await this.prisma.project.delete({ where: { id } });
  }
}
