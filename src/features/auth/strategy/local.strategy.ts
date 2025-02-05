import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(loginOrEmail: string, password: string): Promise<any> {
    // const user = await this.authService.validate(username,password)
    // return user
    if (loginOrEmail === 'admin' && password === 'qwerty') {
      return true;
    }
    throw new UnauthorizedException();
  }
}
