import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../domain/session.entity';
import { Injectable } from '@nestjs/common';
@Injectable()
export class SessionQueryRepository {
  constructor(
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
  ) {}
  async getSessionByUserAndTitle(
    userId: string,
    title: string,
  ): Promise<Session | null> {
    const session = await this.sessionRepository.findOne({
      where: { userId, title },
    });
    debugger;
    if (!session) return null;
    return session;
  }
}
