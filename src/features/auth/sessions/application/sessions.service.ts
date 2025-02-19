import { SessionQueryRepository } from '../infrastructure/session.query.repository';
import { SessionRepository } from '../infrastructure/session.repository';
import { MyJwtService } from '../../infrastructure/my.jwt.service';
import { CreateSessionType } from './types/create.session.type';
import { Injectable } from '@nestjs/common';
@Injectable()
export class SessionsService {
  constructor(
    private sessionQueryRepository: SessionQueryRepository,
    private sessionRepository: SessionRepository,
    private myJwtService: MyJwtService,
  ) {}
  async createSessionAndRefreshToken(
    userId: string,
    title: string,
    ip: string,
  ) {
    const oldSession =
      await this.sessionQueryRepository.getSessionByUserAndTitle(userId, title);
    const deviceId = oldSession?.deviceId || crypto.randomUUID();
    const refreshToken = await this.myJwtService.createPassportRefreshJWT(
      userId,
      deviceId,
    );
    const iat = new Date(refreshToken.iat * 1000);
    debugger;
    const expireDate = new Date(refreshToken.exp * 1000);
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
    return refreshToken.token;
  }
  async getCurrentSession(token: string) {
    const { userId, title } = await this.myJwtService.getTokenData(token);
    return await this.sessionQueryRepository.getSessionByUserAndTitle(
      userId,
      title,
    );
  }
}
