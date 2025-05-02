import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    create(createUserDto: CreateUserDto): Promise<{
        username: string;
        email: string;
        password: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(page?: number, limit?: number, search?: string, sort?: string): Promise<{
        data: {
            username: string;
            email: string;
            password: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
    }>;
    findOne(id: number): Promise<{
        username: string;
        email: string;
        password: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        username: string;
        email: string;
        password: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
    findByUsername(username: string): Promise<{
        username: string;
        email: string;
        password: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findByEmail(email: string): Promise<{
        username: string;
        email: string;
        password: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
