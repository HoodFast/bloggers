import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export class BlogTestManager {
  constructor(protected readonly app: INestApplication) {}

  async createBlog(createBlogData, expectStatus: number) {
    const response = await request(this.app.getHttpServer())
      .post('/blogs')
      .auth('admin', 'qwerty')
      .send(createBlogData)
      .expect(expectStatus);
    return response;
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
