import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ERRORS_CODE,
  InterlayerNotice,
} from '../../../../base/models/inter.layer';

import { LoginOutput } from '../../../users/api/output/login.output';
import { MyJwtService } from '../../infrastructure/my.jwt.service';
import { SessionsService } from '../../sessions/application/sessions.service';
export class GenerateRefreshTokensPairCommand {
  constructor(public token: string) {}
}

@CommandHandler(GenerateRefreshTokensPairCommand)
export class GenerateRefreshTokensPairUseCase
  implements
    ICommandHandler<
      GenerateRefreshTokensPairCommand,
      InterlayerNotice<LoginOutput>
    >
{
  constructor(
    private myJwtService: MyJwtService,
    protected sessionService: SessionsService,
  ) {}

  async execute(
    command: GenerateRefreshTokensPairCommand,
  ): Promise<InterlayerNotice<LoginOutput>> {
    const notice = new InterlayerNotice<LoginOutput>();
    const session = await this.sessionService.getCurrentSession(command.token);
    const accessToken = await this.myJwtService.createPassportJWT(
      session.userId,
    );

    const refreshToken = await this.sessionService.createSessionAndRefreshToken(
      session.userId,
      session.title,
      session.ip,
    );
    if (!refreshToken || !accessToken) {
      notice.addError('error BD', 'error', ERRORS_CODE.ERROR);
      return notice;
    }
    notice.addData({ accessToken, refreshToken });
    return notice;
  }
}
