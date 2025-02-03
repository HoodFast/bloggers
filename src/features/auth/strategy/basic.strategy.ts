import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super(); // Используем стратегию Basic Auth по умолчанию
  }

  async validate(username: string, password: string): Promise<any> {
    debugger;
    return { username, password };
  }
}
