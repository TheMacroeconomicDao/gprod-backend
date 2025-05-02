import { PrismaService } from '../../common/prisma.module';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createProjectDto: CreateProjectDto): Promise<{
        owner: {
            id: number;
            username: string;
            email: string;
            password: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            roles: string[];
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        ownerId: number;
    }>;
    findAll(page?: number, limit?: number, search?: string, sort?: string): Promise<{
        data: ({
            owner: {
                id: number;
                username: string;
                email: string;
                password: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                roles: string[];
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            ownerId: number;
        })[];
        total: number;
    }>;
    findOne(id: number): Promise<{
        owner: {
            id: number;
            username: string;
            email: string;
            password: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            roles: string[];
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        ownerId: number;
    }>;
    update(id: number, updateProjectDto: UpdateProjectDto): Promise<{
        owner: {
            id: number;
            username: string;
            email: string;
            password: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            roles: string[];
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        ownerId: number;
    }>;
    remove(id: number): Promise<void>;
}
