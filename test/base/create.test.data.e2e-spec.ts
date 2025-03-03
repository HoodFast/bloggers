import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestManager } from '../test.manager';

describe('test data', () => {
  let app: INestApplication;
  let httpServer;
  let accessToken;
  let testManager;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
    testManager = new TestManager(app);
    accessToken = await testManager.createAccessToken();

    const testData = [
      {
        name: 'Test Blog 1',
        description: 'Description for Test Blog 1',
        websiteUrl: 'http://testblog1.com',
      },
      {
        name: 'Another Blog',
        description: 'Description for Another Blog',
        websiteUrl: 'http://anotherblog.com',
      },
      {
        name: 'Test Blog 2',
        description: 'Description for Test Blog 2',
        websiteUrl: 'http://testblog2.com',
      },
    ];

    await testData.forEach((i) => {
      request(httpServer).post('/sa/blogs').auth('admin', 'qwerty').send(i);
    });
  });

  afterAll(async () => {});

  it('should return 200 ', async () => {
    const response = await request(httpServer).get('/blogs');
    expect(response.status).toBe(200);
  });
  it('create blog  ', async () => {
    const response = await request(httpServer)
      .post('/sa/blogs')
      .auth('admin', 'qwerty')
      .send({
        name: 'Test Blog 2',
        description: 'Description for Test Blog 2',
        websiteUrl: 'https://testblog2.com',
      });
    expect(response.status).toBe(201);
  });
  it('should return blogs with pagination and sorting', async () => {
    const validToken = 'YOUR_JWT_TOKEN';

    const response = await request(httpServer)
      .get('/blogger/blogs')
      .query({ sortBy: 'createdAt', pageSize: 2, pageNumber: 1 })
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.pagesCount).toBe(2); // Adjust based on your setup
    expect(response.body.page).toBe(1);
    expect(response.body.pageSize).toBe(2);
    expect(response.body.totalCount).toBe(3); // Based on test data size

    const blogs = response.body.items;
    expect(blogs).toHaveLength(2);

    expect(blogs[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Another Blog',
        description: 'Description for Another Blog',
        websiteUrl: 'http://anotherblog.com',
        createdAt: expect.any(String),
        isMembership: expect.any(Boolean),
      }),
    );
  });

  it('should filter blogs by searchNameTerm', async () => {
    const validToken = 'YOUR_JWT_TOKEN'; // Replace with an actual token

    const response = await request(httpServer)
      .get('/blogger/blogs')
      .query({ searchNameTerm: 'Test', pageSize: 2, pageNumber: 1 })
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.totalCount).toBe(2); // Adjust based on filtered data

    const blogs = response.body.items;
    expect(blogs).toHaveLength(2);
    expect(blogs.some((blog) => blog.name.includes('Test'))).toBe(true); // Ensure at least one blog name includes 'Test'
  });
});
