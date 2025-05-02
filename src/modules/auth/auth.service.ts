import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByUsername(createUserDto.username);
    const existingEmail = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser || existingEmail) {
      throw new ConflictException('User already exists');
    }
    const hash = await argon2.hash(createUserDto.password);
    return this.usersService.create({ ...createUserDto, password: hash });
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;
    const valid = await argon2.verify(user.password, password);
    if (!valid) return null;
    return user;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password) as any;
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.id, username: user.username, roles: user.roles };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    };
  }

  async refresh(refreshToken: string) {
    try {
      // TODO: Проверять refresh_token в базе и инвалидировать при логауте/смене пароля
      const payload = await this.jwtService.verifyAsync(refreshToken);
      // Можно добавить проверку в базе, если нужно
      const { sub, username, roles } = payload;
      const new_access_token = await this.jwtService.signAsync({ sub, username, roles }, { expiresIn: '15m' });
      return { access_token: new_access_token };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
