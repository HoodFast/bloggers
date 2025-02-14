import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    cookies: {
      refreshToken?: string; // Указываем тип, что refreshToken может быть строкой или undefined
      [key: string]: any; // Если у вас есть другие куки, вы можете также их типизировать
    };
  }
}
