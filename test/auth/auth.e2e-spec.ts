import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import request from 'supertest';
import { UserTestManager } from '../users/user.test.manager';
import { appSettings } from '../../src/settings/app.settings';
import { EmailServiceMock } from '../base/mocks/sendMailerMock';
import { EmailService } from '../../src/features/auth/infrastructure/email.service';
import { UsersRepository } from '../../src/features/users/infrastructure/users.repository';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../src/features/users/domain/user.entity';

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
  let userRepository: Repository<User>;
  beforeAll(async () => {
    const sendMailerMock = new EmailServiceMock();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue(sendMailerMock)
      .compile();
    app = moduleFixture.createNestApplication();
    appSettings(app);
    await app.init();
    httpServer = app.getHttpServer();
    userRepository = app.get(DataSource).getRepository(User);
    userTestManager = new UserTestManager(app);
    user = await userTestManager.registrationUser(
      testLogin,
      testPassword,
      testEmail,
    );
  });

  afterAll(async () => {

    await request(httpServer).delete('/testing/all-data');
    const dataSource = app.get(DataSource);
    await dataSource.destroy();
    await app.close();
  });

  it('correct login and pass return code 200', async () => {
    const response = await request(httpServer)
      .post('/auth/login')
      .send({ loginOrEmail: testLogin, password: testPassword });
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({ accessToken: expect.any(String) });
  });
  it('registration with already exist login and pass return code 400 and errors array ', async () => {
    const response = await request(httpServer)
      .post('/auth/registration')
      .send({ loginOrEmail: testLogin, password: testPassword });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body).toMatchObject({
      errorsMessages: [
        {
          message: expect.any(String),
          field: expect.any(String),
        },
      ],
    });
  });
  it('incorrect login or pass return code 401', async () => {
    const response1 = await request(httpServer)
      .post('/auth/login')
      .send({ loginOrEmail: 'incorrect login', password: testPassword });
    expect(response1.status).toBe(HttpStatus.UNAUTHORIZED);
    const response2 = await request(httpServer)
      .post('/auth/login')
      .send({ loginOrEmail: testLogin, password: 'incorrect password' });
    expect(response2.status).toBe(HttpStatus.UNAUTHORIZED);
  });
  it('send confirm code for password-recovery', async () => {
    const user = await userTestManager.createUser(
      {
        login: 'login',
        email: 'rabota-trassa@mail.ru',
        password: 'password',
      },
      201,
    );
    const response = await request(httpServer)
      .post('/auth/password-recovery')
      .send({ email: 'rabota-trassa@mail.ru' });

    expect(response.status).toBe(HttpStatus.NO_CONTENT);
  });
  it('change password using recovery code', async () => {
    const testLogin = 'test login';
    const testMail = 'rabota-trassa-test@mail.ru';
    const newPassword = 'newPassword';
    await userTestManager.createUser(
      {
        login: testLogin,
        email: testMail,
        password: testPassword,
      },
      201,
    );
    await request(httpServer)
      .post('/auth/password-recovery')
      .send({ email: testMail });

    const user: User = await userRepository.findOne({
      where: { email: testMail },
    });

    const response = await request(httpServer)
      .post('/auth/new-password')
      .send({ newPassword: newPassword, recoveryCode: user.recoveryCode });
    expect(response.status).toBe(HttpStatus.NO_CONTENT);

    const newResponse = await request(httpServer)
      .post('/auth/login')
      .send({ loginOrEmail: testLogin, password: newPassword });
    expect(newResponse.status).toBe(HttpStatus.OK);
    expect(newResponse.body).toEqual({ accessToken: expect.any(String) });

    const badResponseWithOldPass = await request(httpServer)
      .post('/auth/login')
      .send({ loginOrEmail: testLogin, password: testPassword });
    expect(badResponseWithOldPass.status).toBe(HttpStatus.UNAUTHORIZED);
  });
  it('incorrect login or pass return code 401', async () => {
    const response1 = await request(httpServer)
      .post('/auth/login')
      .send({ loginOrEmail: 'incorrect login', password: testPassword });
    expect(response1.status).toBe(HttpStatus.UNAUTHORIZED);
    const response2 = await request(httpServer)
      .post('/auth/login')
      .send({ loginOrEmail: testLogin, password: 'incorrect password' });
    expect(response2.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});
