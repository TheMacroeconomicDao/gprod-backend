jest.setTimeout(30000);
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupE2EApp } from './setup-e2e';
import { cleanDb } from './clean-db';

describe('Projects search/sort (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await setupE2EApp(app);
    const reg = await request(app.getHttpServer()).post('/api/v1/auth/register').send({ username: 'projuser1', email: 'projuser1@mail.com', password: '123456' });
    expect(reg.status).toBe(201);
    const login = await request(app.getHttpServer()).post('/api/v1/auth/login').send({ username: 'projuser1', password: '123456' });
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
    userId = usersArr.find((u: any) => u.username === 'projuser1').id;
    // Создаём проекты
    await request(app.getHttpServer()).post('/api/v1/projects').set('Authorization', `Bearer ${token}`).send({ title: 'Alpha', description: 'First', ownerId: userId });
    await request(app.getHttpServer()).post('/api/v1/projects').set('Authorization', `Bearer ${token}`).send({ title: 'Beta', description: 'Second', ownerId: userId });
    await request(app.getHttpServer()).post('/api/v1/projects').set('Authorization', `Bearer ${token}`).send({ title: 'Gamma', description: 'Third', ownerId: userId });
  });

  beforeEach(async () => {
    await cleanDb();
  });

  it('поиск по title', async () => {
    // Создаём проект
    const create = await request(app.getHttpServer()).post('/api/v1/projects').set('Authorization', `Bearer ${token}`).send({ title: 'Beta', description: 'desc', ownerId: userId });
    expect(create.status).toBe(201);
    const res = await request(app.getHttpServer()).get('/api/v1/projects?search=Beta').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Beta');
  });

  it('сортировка по title:desc', async () => {
    // Создаём проекты
    await request(app.getHttpServer()).post('/api/v1/projects').set('Authorization', `Bearer ${token}`).send({ title: 'Alpha', description: 'desc', ownerId: userId });
    await request(app.getHttpServer()).post('/api/v1/projects').set('Authorization', `Bearer ${token}`).send({ title: 'Gamma', description: 'desc', ownerId: userId });
    const res = await request(app.getHttpServer()).get('/api/v1/projects?sort=title:desc').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].title).toBe('Gamma');
  });

  afterAll(async () => {
    await app.close();
  });
}); 