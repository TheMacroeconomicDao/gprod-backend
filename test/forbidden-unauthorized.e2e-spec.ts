jest.setTimeout(30000);
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupE2EApp } from './setup-e2e';

describe('Forbidden/Unauthorized (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let userId: number;
  let projectId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await setupE2EApp(app);
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({ username: 'forb', email: 'forb@mail.com', password: '123456' });
    const res = await request(app.getHttpServer()).post('/api/v1/auth/login').send({ username: 'forb', password: '123456' });
    token = res.body.access_token;
    const users = await request(app.getHttpServer()).get('/api/v1/users').set('Authorization', `Bearer ${token}`);
    const usersArr = users.body.data ?? users.body;
    if (!Array.isArray(usersArr)) {
      console.error('users.body:', users.body);
      throw new Error('usersArr is not array');
    }
    userId = usersArr.find((u: any) => u.username === 'forb').id;
    const project = await request(app.getHttpServer()).post('/api/v1/projects').set('Authorization', `Bearer ${token}`).send({ title: 'Forb', description: 'desc', ownerId: userId });
    projectId = project.body.id;
  });

  it('без JWT нельзя получить проекты', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/projects');
    expect(res.status).toBe(401);
  });

  it('без JWT нельзя создать проект', async () => {
    const res = await request(app.getHttpServer()).post('/api/v1/projects').send({ title: 'fail', description: 'fail', ownerId: userId });
    expect(res.status).toBe(401);
  });

  it('user не может удалить чужой проект', async () => {
    // создаём второго пользователя
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({ username: 'forb2', email: 'forb2@mail.com', password: '123456' });
    const res2 = await request(app.getHttpServer()).post('/api/v1/auth/login').send({ username: 'forb2', password: '123456' });
    const token2 = res2.body.access_token;
    const del = await request(app.getHttpServer()).delete(`/api/v1/projects/${projectId}`).set('Authorization', `Bearer ${token2}`);
    expect(del.status).toBe(403);
  });

  afterAll(async () => {
    await app.close();
  });
}); 