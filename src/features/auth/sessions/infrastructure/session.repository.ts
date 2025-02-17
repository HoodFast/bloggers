import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../domain/session.entity';
import { Not, Repository } from 'typeorm';
import { CreateSessionType } from '../application/types/create.session.type';
import { Injectable } from '@nestjs/common';
@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
  ) {}
  async createSession(data: CreateSessionType): Promise<Session | null> {
    const session = new Session();
    session.iat = data.iat;
    session.ip = data.ip;
    session.userId = data.userId;
    session.deviceId = data.deviceId;
    session.title = data.title;
    session.expireDate = data.expireDate;
    const res = await this.sessionRepository.save(session);
    if (!res) return null;
    return res;
  }
  async deleteSession(id: string): Promise<boolean> {
    const res = await this.sessionRepository.delete(id);
    return res.affected > 0;
  }
  async deleteAllSessionsExceptCurrent(userId: string, sessionId: string) {
    const deleteSessions = await this.sessionRepository.delete({
      userId: userId,
      id: Not(sessionId),
    });
    return deleteSessions.affected > 0;
  }
}
