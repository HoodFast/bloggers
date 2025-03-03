import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export class BlogTestManager {
  constructor(protected readonly app: INestApplication) {}

  async createBlog(createBlogData, expectStatus: number) {
    const response = await request(this.app.getHttpServer())
      .post('/sa/blogs')
      .auth('admin', 'qwerty')
      .send(createBlogData)
      .expect(expectStatus);
    return response;
  }
  async createManyBlogs(count: number) {
    const blogData = [];
    for (let i = 0; i < count; i++) {
      blogData.push({
        name: `Test Blog ${i}`,
        description: `Description for Test Blog ${i}`,
        websiteUrl: `https://testblog${i}.com`,
      });
    }
    await Promise.all(
      blogData.map(async (i) => {
        await request(this.app.getHttpServer())
          .post('/sa/blogs')
          .auth('admin', 'qwerty')
          .send(i);
      }),
    );
    return;
  }
  checkAllBlogsBody(response: any) {
    const blogs = response.body;
    expect(blogs).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 4,
      items: expect.any(Array),
    });
  }
}
