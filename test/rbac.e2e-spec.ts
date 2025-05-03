jest.setTimeout(30000);
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupE2EApp } from './setup-e2e';
import { cleanDb } from './clean-db';

// Хелпер для регистрации и логина
async function registerAndLogin(app: INestApplication, user: any) {
  const reg = await request(app.getHttpServer())
    .post('/api/v1/auth/register')
    .send(user);
  expect(reg.status).toBe(201);
  const res = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ username: user.username, password: user.password });
  expect(res.status).toBe(200);
  expect(res.body.access_token).toBeDefined();
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
    await setupE2EApp(app);
    // Создаём admin и user с уникальными username/email
    adminToken = await registerAndLogin(app, { username: 'adminrbac', email: 'adminrbac@mail.com', password: 'admin123', roles: ['admin'] });
    userToken = await registerAndLogin(app, { username: 'userrbac', email: 'userrbac@mail.com', password: 'user123', roles: ['user'] });
    // Получаем id user
    const users = await request(app.getHttpServer()).get('/api/v1/users').set('Authorization', `Bearer ${adminToken}`);
    expect(users.status).toBe(200);
    const usersArr = users.body.data ?? users.body;
    if (!Array.isArray(usersArr)) {
      console.error('users.body:', users.body);
      throw new Error('usersArr is not array');
    }
    userId = usersArr.find((u: any) => u.username === 'userrbac').id;
  });

  beforeEach(async () => {
    await cleanDb();
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