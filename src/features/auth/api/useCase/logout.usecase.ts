import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ERRORS_CODE,
  InterlayerNotice,
} from '../../../../base/models/inter.layer';

import { LoginOutput } from '../../../users/api/output/login.output';
import { MyJwtService } from '../../infrastructure/my.jwt.service';
import { OutputUsersType } from '../../../users/api/output/user.output';
import { SessionsService } from '../../sessions/application/sessions.service';
import { SessionRepository } from '../../sessions/infrastructure/session.repository';
import { SessionQueryRepository } from '../../sessions/infrastructure/session.query.repository';
export class LogoutCommand {
  constructor(public token: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase
  implements ICommandHandler<LogoutCommand, InterlayerNotice<boolean>>
{
  constructor(
    protected sessionRepository: SessionRepository,
    protected sessionQueryRepository: SessionQueryRepository,
    private myJwtService: MyJwtService,
  ) {}

  async execute(command: LogoutCommand): Promise<InterlayerNotice<boolean>> {
    const notice = new InterlayerNotice<boolean>();
    const tokenData = await this.myJwtService.getTokenData(command.token);
    const currentSession =
      await this.sessionQueryRepository.getSessionByUserAndTitle(
        tokenData.userId,
        tokenData.title,
      );
    if (!currentSession) {
      notice.addError('session not exist', 'error', ERRORS_CODE.UNAUTHORIZED);
      return notice;
    }
    const deleteAllSessions =
      await this.sessionRepository.deleteAllSessionsExceptCurrent(
        tokenData.userId,
        currentSession.id,
      );
    notice.addData(deleteAllSessions);
    return notice;
  }
}
