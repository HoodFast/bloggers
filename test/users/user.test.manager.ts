import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export class UserTestManager {
  constructor(protected readonly app: INestApplication) {}

  expectCorrectModel(createModel: any, responseModel: any) {
    expect(createModel.name).toBe(responseModel.name);
  }

  async deleteUser(id: string) {
    await request(this.app.getHttpServer())
      .delete(`/users/${id}`)
      .auth('admin', 'qwerty')
      .expect(204);
  }

  async deleteAll() {
    await request(this.app.getHttpServer()).delete(`/testing/all-data`);
  }
  async registrationUser(login: string, password: string, email: string) {
    const res = await request(this.app.getHttpServer())
      .post('/auth/registration')
      .send({ login, password, email })
      .expect(204);

    return res.body;
  }
  async createManyUser(count: number) {
    const users: {
      id?: string;
      login?: string;
      email?: string;
      accessToken?: string;
      refreshToken?: string;
    }[] = [];
    const usersTestData = [];
    for (let i = 0; i < count; i++) {
      const uniqueChar = this.generateRandomString();
      usersTestData.push({
        login: `login${uniqueChar}`,
        password: `password`,
        email: `rabota-trassa${uniqueChar}@mail.ru`,
      });
    }
    await Promise.all(
      usersTestData.map(async (i) => {
        const user = await request(this.app.getHttpServer())
          .post('/sa/users')
          .auth('admin', 'qwerty')
          .send(i);
        users.push({
          login: user.body.login,
          email: user.body.email,
          id: user.body.id,
        });
      }),
    );
    await Promise.all(
      users.map(async (i) => {
        const data = await request(this.app.getHttpServer())
          .post('/auth/login')
          .send({ loginOrEmail: i.login, password: 'password' });
        const user = users.find((u) => u.login === i.login);
        user.accessToken = data.body.accessToken;
        user.refreshToken = data.headers['set-cookie'][0].split('=')[1];
      }),
    );
    return users;
  }
  async createUser(createUserData, expectStatus: number) {
    const response = await request(this.app.getHttpServer())
      .post('/sa/users')
      .auth('admin', 'qwerty')
      .send({ ...createUserData })
      .expect(expectStatus);
    return response;
  }

  async login(
    login: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await request(this.app.getHttpServer())
      .post('/login')
      .send({ login, password })
      .expect(200);
    return {
      accessToken: response.body.accessToken,
      refreshToken: response.headers['set-cookie'][0]
        .split('=')[1]
        .split(';')[0],
    };
  }
  generateRandomString() {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
  checkValidateErrors(response: any) {
    const result = response.body;

    expect(result).toEqual({
      errorsMessages: [
        { message: expect.any(String), field: expect.any(String) },
        { message: expect.any(String), field: expect.any(String) },
      ],
    });
  }
}
