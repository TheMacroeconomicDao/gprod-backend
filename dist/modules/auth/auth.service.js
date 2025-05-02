"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const argon2 = require("argon2");
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(createUserDto) {
        const existingUser = await this.usersService.findByUsername(createUserDto.username);
        const existingEmail = await this.usersService.findByEmail(createUserDto.email);
        if (existingUser || existingEmail) {
            throw new common_1.ConflictException('User already exists');
        }
        const hash = await argon2.hash(createUserDto.password);
        return this.usersService.create({ ...createUserDto, password: hash });
    }
    async validateUser(username, password) {
        const user = await this.usersService.findByUsername(username);
        if (!user)
            return null;
        const valid = await argon2.verify(user.password, password);
        if (!valid)
            return null;
        return user;
    }
    async login(username, password) {
        const user = await this.validateUser(username, password);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const payload = { sub: user.id, username: user.username, roles: user.roles };
        return {
            access_token: await this.jwtService.signAsync(payload),
            refresh_token: await this.jwtService.signAsync(payload, { expiresIn: '7d' }),
        };
    }
    async refresh(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken);
            const { sub, username, roles } = payload;
            const new_access_token = await this.jwtService.signAsync({ sub, username, roles }, { expiresIn: '15m' });
            return { access_token: new_access_token };
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map