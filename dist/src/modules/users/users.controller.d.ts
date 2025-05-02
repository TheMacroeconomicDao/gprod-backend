import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, req: any): Promise<{
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
    findOne(id: string): Promise<{
        id: number;
        username: string;
        email: string;
        password: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        roles: string[];
    }>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<{
        id: number;
        username: string;
        email: string;
        password: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        roles: string[];
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
