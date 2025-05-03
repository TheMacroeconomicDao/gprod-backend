jest.setTimeout(30000);
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupE2EApp } from './setup-e2e';

describe('Projects update (e2e)', () => {
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

    await request(app.getHttpServer()).post('/api/v1/auth/register').send({ username: 'projupd', email: 'projupd@mail.com', password: '123456' });
    const res = await request(app.getHttpServer()).post('/api/v1/auth/login').send({ username: 'projupd', password: '123456' });
    token = res.body.access_token;
    const users = await request(app.getHttpServer()).get('/api/v1/users').set('Authorization', `Bearer ${token}`);
    const usersArr = users.body.data ?? users.body;
    if (!Array.isArray(usersArr)) {
      console.error('users.body:', users.body);
      throw new Error('usersArr is not array');
    }
    userId = usersArr.find((u: any) => u.username === 'projupd').id;
    const project = await request(app.getHttpServer()).post('/api/v1/projects').set('Authorization', `Bearer ${token}`).send({ title: 'Upd', description: 'desc', ownerId: userId });
    projectId = project.body.id;
  });

  it('user может обновить свой проект', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated');
  });

  it('без JWT нельзя обновить проект', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/projects/${projectId}`)
      .send({ title: 'fail' });
    expect(res.status).toBe(401);
  });

  afterAll(async () => {
    await app.close();
  });
}); 