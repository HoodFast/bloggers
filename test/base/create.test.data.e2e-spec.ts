import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestManager } from '../test.manager';
import { BlogTestManager } from '../blogs/blog.test.manager';
import { UserTestManager } from '../users/user.test.manager';
import { appSettings } from '../../src/settings/app.settings';

describe('test data', () => {
  let app: INestApplication;
  let httpServer;
  let accessToken;
  let blogTestManager: BlogTestManager;
  let userTestManager: UserTestManager;
  let testManager: TestManager;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    appSettings(app);
    httpServer = app.getHttpServer();
    testManager = new TestManager(app);
    blogTestManager = new BlogTestManager(app);
    userTestManager = new UserTestManager(app);
    accessToken = await testManager.createAccessToken();
  });

  afterAll(async () => {
    // await request(httpServer).delete('/testing/all-data');
  });

  it('should return 200 ', async () => {
    const response = await request(httpServer).get('/blogs');
    expect(response.status).toBe(200);
  });
  it('create blogs  ', async () => {
    await blogTestManager.createManyBlogs(50);
  });
  it('create many users  ', async () => {
    const users = await userTestManager.createManyUser(2);
  });
});
