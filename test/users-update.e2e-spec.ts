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

    const regAdmin = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ username: 'admin2upd', email: 'admin2upd@mail.com', password: 'admin123', roles: ['admin'] });
    expect(regAdmin.status).toBe(201);
    const loginAdmin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ username: 'admin2upd', password: 'admin123' });
    expect(loginAdmin.status).toBe(200);
    expect(loginAdmin.body.access_token).toBeDefined();
    adminToken = loginAdmin.body.access_token;

    const regUser = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ username: 'user2upd', email: 'user2upd@mail.com', password: 'user123', roles: ['user'] });
    expect(regUser.status).toBe(201);
    const loginUser = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ username: 'user2upd', password: 'user123' });
    expect(loginUser.status).toBe(200);
    expect(loginUser.body.access_token).toBeDefined();
    userToken = loginUser.body.access_token;

    const users = await request(app.getHttpServer()).get('/api/v1/users').set('Authorization', `Bearer ${adminToken}`);
    expect(users.status).toBe(200);
    const usersArr = users.body.data ?? users.body;
    if (!Array.isArray(usersArr)) {
      console.error('users.body:', users.body);
      throw new Error('usersArr is not array');
    }
    userId = usersArr.find((u: any) => u.username === 'user2upd').id;
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

  it('после удаления пользователя его проекты остаются, а ownerId становится null', async () => {
    // Создаём проект от имени user2
    const projectRes = await request(app.getHttpServer())
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'project-user2', description: 'desc' });
    expect(projectRes.status).toBe(201);
    const projectId = projectRes.body.id;

    // Удаляем пользователя
    const delRes = await request(app.getHttpServer())
      .delete(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(delRes.status).toBe(200);

    // Проверяем, что проект остался, а ownerId стал null
    const getProject = await request(app.getHttpServer())
      .get(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(getProject.status).toBe(200);
    expect(getProject.body.ownerId).toBeNull();
    expect(getProject.body.owner).toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
}); 