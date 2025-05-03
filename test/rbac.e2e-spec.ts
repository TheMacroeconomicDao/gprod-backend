jest.setTimeout(30000);
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

// Хелпер для регистрации и логина
async function registerAndLogin(app: INestApplication, user: any) {
  await request(app.getHttpServer())
    .post('/api/v1/auth/register')
    .send(user);
  const res = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ username: user.username, password: user.password });
  return res.body.access_token;
}

describe('RBAC (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    // Создаём admin и user
    adminToken = await registerAndLogin(app, { username: 'admin', email: 'admin@mail.com', password: 'admin123', roles: ['admin'] });
    userToken = await registerAndLogin(app, { username: 'user', email: 'user@mail.com', password: 'user123', roles: ['user'] });
    // Получаем id user
    const users = await request(app.getHttpServer()).get('/api/v1/users').set('Authorization', `Bearer ${adminToken}`);
    const usersArr = users.body.data ?? users.body;
    if (!Array.isArray(usersArr)) {
      console.error('users.body:', users.body);
      throw new Error('usersArr is not array');
    }
    userId = usersArr.find((u: any) => u.username === 'user').id;
  });

  it('user не может удалить пользователя', async () => {
    await request(app.getHttpServer())
      .delete(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('admin может удалить пользователя', async () => {
    await request(app.getHttpServer())
      .delete(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
}); 