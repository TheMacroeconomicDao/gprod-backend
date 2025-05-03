jest.setTimeout(30000);
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupE2EApp } from './setup-e2e';

describe('Users update/soft-delete (e2e)', () => {
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

    adminToken = (await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ username: 'admin2', email: 'admin2@mail.com', password: 'admin123', roles: ['admin'] })
      .then(() => request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ username: 'admin2', password: 'admin123' }))).body.access_token;
    userToken = (await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ username: 'user2', email: 'user2@mail.com', password: 'user123', roles: ['user'] })
      .then(() => request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ username: 'user2', password: 'user123' }))).body.access_token;
    const users = await request(app.getHttpServer()).get('/api/v1/users').set('Authorization', `Bearer ${adminToken}`);
    const usersArr = users.body.data ?? users.body;
    if (!Array.isArray(usersArr)) {
      console.error('users.body:', users.body);
      throw new Error('usersArr is not array');
    }
    userId = usersArr.find((u: any) => u.username === 'user2').id;
  });

  it('user может обновить свой email', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ email: 'newuser2@mail.com' });
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('newuser2@mail.com');
  });

  it('user не может обновить roles', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ roles: ['admin'] });
    expect(res.status).toBe(403);
  });

  it('admin может обновить roles', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ roles: ['admin'] });
    expect(res.status).toBe(200);
    expect(res.body.roles).toContain('admin');
  });

  it('soft-delete (isActive=false) работает', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    const user = await request(app.getHttpServer())
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(user.body.isActive).toBe(false);
  });

  afterAll(async () => {
    await app.close();
  });
}); 