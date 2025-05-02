import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: CreateProjectDto): Promise<{
        owner: {
            username: string;
            email: string;
            password: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
    }>;
    findAll(page?: number, limit?: number, search?: string, sort?: string): Promise<{
        data: ({
            owner: {
                username: string;
                email: string;
                password: string;
                id: number;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            description: string | null;
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            ownerId: number;
        })[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        owner: {
            username: string;
            email: string;
            password: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
    }>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<{
        owner: {
            username: string;
            email: string;
            password: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
    }>;
    remove(id: string): Promise<void>;
}
