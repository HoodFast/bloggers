import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';
import { ConfigurationType } from '../../../settings/configurations';

@Injectable()
export class MyJwtService {
  constructor(
    private configService: ConfigService<ConfigurationType, true>,
    private jwtService: JwtService,
  ) {}

  private jwtSettings = this.configService.get('jwtSettings', { infer: true });
  private AC_SECRET = this.jwtSettings.AC_SECRET;
  private AC_TIME = this.jwtSettings.AC_TIME;
  private RT_SECRET = this.jwtSettings.RT_SECRET;
  private RT_TIME = this.jwtSettings.RT_TIME;

  async createPassportJWT(userId: string): Promise<string> {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.AC_SECRET,
        expiresIn: this.AC_TIME,
      },
    );
  }

  async createPassportRefreshJWT(
    userId: string,
    deviceId: string,
  ): Promise<{ token: string; iat: number; exp: number } | null> {
    const token = this.jwtService.sign(
      { userId, deviceId },
      {
        secret: this.RT_SECRET,
        expiresIn: this.RT_TIME,
      },
    );
    const decoded = await this.jwtService.decode(token);
    return { token, iat: decoded.iat, exp: decoded.exp };
  }
  async getTokenData(
    token: string,
  ): Promise<{ userId: string; title: string } | null> {
    try {
      const decoded = await this.jwtService.decode(token);
      return { userId: decoded.userId, title: decoded.title };
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
