import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ERRORS_CODE,
  InterlayerNotice,
} from '../../../../base/models/inter.layer';

import { EmailService } from '../../infrastructure/email.service';
import { UsersRepo } from '../../../users/infrastructure/users.repository';

export class RecoveryPasswordCommand {
  constructor(public email: string) {}
}

@CommandHandler(RecoveryPasswordCommand)
export class RecoveryUseCase
  implements ICommandHandler<RecoveryPasswordCommand, InterlayerNotice<boolean>>
{
  constructor(
    private emailService: EmailService,
    protected usersRepository: UsersRepo,
  ) {}

  async execute(
    command: RecoveryPasswordCommand,
  ): Promise<InterlayerNotice<boolean>> {
    const notice = new InterlayerNotice<boolean>();
    const user = await this.usersRepository.getUserByEmail(command.email);
    if (!user) {
      notice.addError('user not exist', 'error', ERRORS_CODE.NOT_FOUND);
      return notice;
    }
    const recoveryCode = crypto.randomUUID();
    const updateCode = await this.usersRepository.addRecoveryCode(
      user.id,
      recoveryCode,
    );
    if (!updateCode) {
      notice.addError('error for recovery code', 'error', ERRORS_CODE.ERROR);
      return notice;
    }
    const message = `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
      </p>`;
    const sendRecoveryCode = await this.emailService.sendEmail(
      user.email,
      'recovery code',
      message,
    );

    if (!sendRecoveryCode) {
      notice.addError('error email service', 'error', ERRORS_CODE.BAD_REQUEST);
      return notice;
    }
    notice.addData(sendRecoveryCode);
    return notice;
  }
}
