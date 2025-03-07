import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Session } from "../domain/session.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SessionQueryRepository {
  constructor(
    @InjectRepository(Session) private sessionRepository: Repository<Session>
  ) {
  }

  async getSessionByUserAndTitle(
    userId: string,
    title: string
  ): Promise<Session | null> {
    const session = await this.sessionRepository.findOne({
      where: { userId, title }
    });

    if (!session) return null;
    return session;
  }

  async getSessionByUserAndTitleAndIat(
    userId: string,
    title: string,
    iat: Date
  ): Promise<Session | null> {

    try {
      const date = new Date(+iat * 1000);
      const session = await this.sessionRepository.findOne({
        where: { userId, iat: date }
      });

      if (!session) return null;
      return session;
    } catch (e) {

      console.log(e);
    }

  }

  async getSessionByUserIdAndIat(userId: string, iat: string) {
    const session = await this.sessionRepository.findOne({
      where: { userId, iat: new Date(+iat * 1000) }
    });
    return session;
  }
}
