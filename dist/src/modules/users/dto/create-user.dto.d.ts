export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare class CreateUserDto {
    username: string;
    email: string;
    password: string;
    roles?: UserRole[];
}
