import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import request from 'supertest';
import { UserTestManager } from '../users/user.test.manager';
import { appSettings } from '../../src/settings/app.settings';

describe('auth (e2e)', () => {
  const testLogin = 'test user';
  const testPassword = 'test pass';
  const testEmail = 'test@mail.com';
  let app: INestApplication;
  let httpServer;
  let accessToken;
  let user;
  let userTestManager: UserTestManager;
  let testManager;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSettings(app);
    await app.init();
    httpServer = app.getHttpServer();
    userTestManager = new UserTestManager(app);
    user = await userTestManager.registrationUser(
      testLogin,
      testPassword,
      testEmail,
    );
  });

  afterAll(async () => {
    await request(httpServer).delete('/testing/all-data');
  });

  it('correct login and pass return code 200', async () => {
    const response = await request(httpServer)
      .post('/auth/login')
      .send({ loginOrEmail: testLogin, password: testPassword });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ accessToken: expect.any(String) });
  });
  it('already exist login and pass return code 400 and errors array ', async () => {
    const response = await request(httpServer)
      .post('/auth/registration')
      .send({ loginOrEmail: testLogin, password: testPassword });
    expect(response.status).toBe(400);
    debugger;
    expect(response.body).toMatchObject({
      errorsMessages: [
        {
          message: expect.any(String),
          field: expect.any(String),
        },
      ],
    });
  });
});
