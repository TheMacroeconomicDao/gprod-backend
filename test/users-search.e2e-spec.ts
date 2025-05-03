jest.setTimeout(30000);
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupE2EApp } from './setup-e2e';

describe('Users search/sort (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await setupE2EApp(app);
    const reg1 = await request(app.getHttpServer()).post('/api/v1/auth/register').send({ username: 'alice1', email: 'alice1@mail.com', password: '123456' });
    expect(reg1.status).toBe(201);
    const reg2 = await request(app.getHttpServer()).post('/api/v1/auth/register').send({ username: 'bob1', email: 'bob1@mail.com', password: '123456' });
    expect(reg2.status).toBe(201);
    const reg3 = await request(app.getHttpServer()).post('/api/v1/auth/register').send({ username: 'vasya1', email: 'vasya1@mail.com', password: '123456' });
    expect(reg3.status).toBe(201);
    const login = await request(app.getHttpServer()).post('/api/v1/auth/login').send({ username: 'vasya1', password: '123456' });
    expect(login.status).toBe(200);
    expect(login.body.access_token).toBeDefined();
    token = login.body.access_token;
    const users = await request(app.getHttpServer()).get('/api/v1/users').set('Authorization', `Bearer ${token}`);
    expect(users.status).toBe(200);
    const usersArr = users.body.data ?? users.body;
    if (!Array.isArray(usersArr)) {
      console.error('users.body:', users.body);
      throw new Error('usersArr is not array');
    }
    userId = usersArr.find((u: any) => u.username === 'vasya1').id;
  });

  it('поиск по username', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/users?search=vasya1').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].username).toBe('vasya1');
  });

  it('сортировка по username:desc', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/users?sort=username:desc').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].username).toBe('vasya1');
  });

  afterAll(async () => {
    await app.close();
  });
}); 