import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<{
        id: number;
        username: string;
        email: string;
        password: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        roles: string[];
    }>;
    validateUser(username: string, password: string): Promise<{
        id: number;
        username: string;
        email: string;
        password: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        roles: string[];
    } | null>;
    login(username: string, password: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
    }>;
}
