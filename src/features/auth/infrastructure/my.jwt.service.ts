import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';
import { ConfigurationType } from '../../../settings/configurations';
import { CreateSessionType } from '../sessions/application/types/create.session.type';
import { SessionQueryRepository } from '../sessions/infrastructure/session.query.repository';
import { SessionRepository } from '../sessions/infrastructure/session.repository';

@Injectable()
export class MyJwtService {
  constructor(
    private configService: ConfigService<ConfigurationType, true>,
    private jwtService: JwtService,
    private sessionQueryRepository: SessionQueryRepository,
    private sessionRepository: SessionRepository,
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
        secret: this.RT_SECRET,
        expiresIn: this.RT_TIME,
      },
    );
  }
  async createAccessToken(userId: string, title: string, ip: string) {
    const oldSession =
      await this.sessionQueryRepository.getSessionByUserAndTitle(userId, title);
    const deviceId = oldSession?.deviceId || crypto.randomUUID();
    const accessToken = await this.createAccessJWTAndDecode(userId, deviceId);

    const iat = new Date(accessToken.iat * 1000);

    const expireDate = new Date(accessToken.exp * 1000);
    const sessionMetaData: CreateSessionType = {
      userId,
      deviceId,
      title,
      ip,
      iat,
      expireDate,
    };
    if (oldSession) {
      await this.sessionRepository.deleteSession(oldSession.id);
    }
    const session = await this.sessionRepository.createSession(sessionMetaData);
    if (!session) return null;
    return accessToken.token;
  }
  async createAccessJWTAndDecode(
    userId: string,
    deviceId: string,
  ): Promise<{ token: string; iat: number; exp: number } | null> {
    const token = this.jwtService.sign(
      { userId, deviceId },
      {
        secret: this.AC_SECRET,
        expiresIn: this.AC_TIME,
      },
    );
    const decoded = await this.jwtService.decode(token);
    return { token, iat: decoded.iat, exp: decoded.exp };
  }
  async getTokenData(
    token: string,
  ): Promise<{ userId: string; title: string,iat:Date } | null> {
    try {
      const decoded = await this.jwtService.decode(token);

      return { userId: decoded.userId, title: decoded.title, iat: decoded.iat };
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
