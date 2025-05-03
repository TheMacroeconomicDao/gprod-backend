jest.setTimeout(30000);
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupE2EApp } from './setup-e2e';

describe('Users search/sort (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await setupE2EApp(app);

    // Создаём пользователей
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({ username: 'alice', email: 'alice@mail.com', password: '123456' });
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({ username: 'bob', email: 'bob@mail.com', password: '123456' });
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({ username: 'vasya', email: 'vasya@mail.com', password: '123456' });
    // Логинимся
    const res = await request(app.getHttpServer()).post('/api/v1/auth/login').send({ username: 'alice', password: '123456' });
    token = res.body.access_token;
  });

  it('поиск по username', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/users?search=vasya').set('Authorization', `Bearer ${token}`);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].username).toBe('vasya');
  });

  it('сортировка по username:desc', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/users?sort=username:desc').set('Authorization', `Bearer ${token}`);
    expect(res.body.data[0].username).toBe('vasya');
  });

  afterAll(async () => {
    await app.close();
  });
}); 