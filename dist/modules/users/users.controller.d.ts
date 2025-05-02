import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, req: any): Promise<{
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
    findOne(id: string): Promise<{
        username: string;
        email: string;
        password: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<{
        username: string;
        email: string;
        password: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
