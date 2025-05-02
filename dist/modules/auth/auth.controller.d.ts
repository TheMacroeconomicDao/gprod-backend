import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Request as ExpressRequest } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: CreateUserDto): Promise<{
        username: string;
        email: string;
        password: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(req: ExpressRequest): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(refresh_token: string): Promise<{
        access_token: string;
    }>;
}
