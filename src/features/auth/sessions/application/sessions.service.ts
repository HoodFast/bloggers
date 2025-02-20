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

  async getCurrentSession(token: string) {
    const { userId, title } = await this.myJwtService.getTokenData(token);
    return await this.sessionQueryRepository.getSessionByUserAndTitle(
      userId,
      title,
    );
  }
}
