import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;

  beforeEach(async () => {
    const userMock = {
      id: 1,
      username: 'vasya',
      email: 'vasya@mail.com',
      password: 'hash',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: ['user'],
    };
    module = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test-secret' })],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn().mockResolvedValue(userMock),
            findByEmail: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    service.validateUser = jest.fn().mockResolvedValue(userMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('login включает roles в payload', async () => {
    const user = { id: 1, username: 'vasya', password: 'hash', roles: ['admin'] };
    service.validateUser = jest.fn().mockResolvedValue(user);
    const jwtService = module.get<any>('JwtService');
    jwtService.signAsync = jest.fn().mockResolvedValue('token');
    const result = await service.login('vasya', 'qwerty');
    expect(jwtService.signAsync).toBeCalledWith({ sub: 1, username: 'vasya', roles: ['admin'] });
    expect(result).toEqual({ access_token: 'token' });
  });
});
