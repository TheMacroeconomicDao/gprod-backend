import { PrismaService } from '../../common/prisma.module';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        id: number;
        username: string;
        email: string;
        password: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        roles: string[];
    }>;
    findAll(page?: number, limit?: number, search?: string, sort?: string): Promise<{
        data: {
            id: number;
            username: string;
            email: string;
            password: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            roles: string[];
        }[];
        total: number;
    }>;
    findOne(id: number): Promise<{
        id: number;
        username: string;
        email: string;
        password: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        roles: string[];
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        id: number;
        username: string;
        email: string;
        password: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        roles: string[];
    }>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
    findByUsername(username: string): Promise<{
        id: number;
        username: string;
        email: string;
        password: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        roles: string[];
    } | null>;
    findByEmail(email: string): Promise<{
        id: number;
        username: string;
        email: string;
        password: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        roles: string[];
    } | null>;
}
