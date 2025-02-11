import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ERRORS_CODE,
  InterlayerNotice,
} from '../../../../base/models/inter.layer';

import { MyJwtService } from '../../infrastructure/my.jwt.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
export class ChangePasswordCommand {
  constructor(
    public newPassword: string,
    public recoveryCode: string,
  ) {}
}

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordUseCase
  implements ICommandHandler<ChangePasswordCommand, InterlayerNotice<boolean>>
{
  constructor(
    private myJwtService: MyJwtService,
    protected userRepository: UsersRepository,
  ) {}

  async execute(
    command: ChangePasswordCommand,
  ): Promise<InterlayerNotice<boolean>> {
    const notice = new InterlayerNotice<boolean>();
    const user = await this.userRepository.getUserByRecoveryCode(
      command.recoveryCode,
    );
    if (!user) {
      notice.addError('invalid code', 'error', ERRORS_CODE.FORBIDDEN);
      return notice;
    }
    const res = await this.userRepository.changePassword(
      user.id,
      command.newPassword,
    );
    if (!res) {
      notice.addError('error db', 'error', ERRORS_CODE.FORBIDDEN);
      return notice;
    }
    notice.addData(true);
    return notice;
  }
}
