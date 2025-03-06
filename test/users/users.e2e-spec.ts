import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { UserTestManager } from './user.test.manager';

describe('users (e2e)', () => {
  let app: INestApplication;
  let httpServer;
  let userTestManager;
  beforeAll(async () => {

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
    userTestManager = new UserTestManager(app);
  });

  afterAll(async () => {});

  it('create user', async () => {
    await userTestManager.createUser(
      {
        login: 'jf8Kf_6ul0',
        password: 'string',
        email: 'example@example.com',
      },
      201,
    );
  });
  it('get all users', async () => {
    await userTestManager.createUser(
      {
        login: 'test',
        password: 'string',
        email: 'test@example.com',
      },
      201,
    );
    const res = await request(httpServer).get('/sa/users');
    expect(res.body).toEqual({
      pagesCount: 0,
      page: 0,
      pageSize: 0,
      totalCount: 0,
      items: expect.any(Array),
    });
  });
  it('delete user', async () => {
    await userTestManager.createUser(
      {
        login: 'test',
        password: 'string',
        email: 'test@example.com',
      },
      201,
    );
    const res = await request(httpServer).get('/sa/users');
    const count = res.body.totalCount;
    const userId = res.body.items[0].id;
    await userTestManager.deleteUser(userId);
    const total = await request(httpServer).get('/sa/users');
    expect(total.body.totalCount).toBe(count - 1);
  });
});
