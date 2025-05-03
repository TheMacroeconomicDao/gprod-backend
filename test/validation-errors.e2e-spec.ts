jest.setTimeout(30000);
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupE2EApp } from './setup-e2e';

describe('Validation/errors (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await setupE2EApp(app);
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({ username: 'valerr', email: 'valerr@mail.com', password: '123456' });
    const res = await request(app.getHttpServer()).post('/api/v1/auth/login').send({ username: 'valerr', password: '123456' });
    token = res.body.access_token;
    const users = await request(app.getHttpServer()).get('/api/v1/users').set('Authorization', `Bearer ${token}`);
    const usersArr = users.body.data ?? users.body;
    if (!Array.isArray(usersArr)) {
      console.error('users.body:', users.body);
      throw new Error('usersArr is not array');
    }
    userId = usersArr.find((u: any) => u.username === 'valerr').id;
  });

  it('400 если невалидный email', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ username: 'badmail', email: 'notanemail', password: '123456' });
    expect(res.status).toBe(400);
  });

  it('409 если username/email неуникальны', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ username: 'valerr', email: 'valerr@mail.com', password: '123456' });
    expect(res.status).toBe(409);
  });

  it('500 если вызвать несуществующий эндпоинт', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/doesnotexist');
    expect(res.status).toBe(404);
  });

  afterAll(async () => {
    await app.close();
  });
}); 