import { SessionQueryRepository } from '../infrastructure/session.query.repository';
import { SessionRepository } from '../infrastructure/session.repository';

export class SessionsService {
  constructor(
    private sessionQueryRepository: SessionQueryRepository,
    private sessionRepository: SessionRepository,
  ) {}
  async createOrUpdateSession() {
    const oldSession = await this.sessionQueryRepository.getSessionByIp();
    if (!oldSession) {
      await this.sessionRepository.createSession();
    }
    await this.sessionRepository.updateSession();
    return true;
  }
}
