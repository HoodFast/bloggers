import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../../base/models/inter.layer';

import { LoginOutput } from '../../../users/api/output/login.output';
import { MyJwtService } from '../../infrastructure/my.jwt.service';
import { OutputUsersType } from '../../../users/api/output/user.output';
export class LoginCommand {
  constructor(public data: OutputUsersType) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase
  implements ICommandHandler<LoginCommand, InterlayerNotice<LoginOutput>>
{
  constructor(private myJwtService: MyJwtService) {}

  async execute(command: LoginCommand): Promise<InterlayerNotice<LoginOutput>> {
    const notice = new InterlayerNotice<LoginOutput>();
    const accessToken = await this.myJwtService.createPassportJWT(
      command.data.id,
    );

    const refreshToken = await this.myJwtService.createPassportRefreshJWT(
      command.data.id,
    );
    if (!refreshToken || !accessToken) {
      notice.addError('error BD');
      return notice;
    }
    notice.addData({ accessToken, refreshToken });
    return notice;
  }
}
