import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ERRORS_CODE,
  InterlayerNotice,
} from '../../../../base/models/inter.layer';

import { UsersQueryRepo } from '../../../users/infrastructure/users.query.repository';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
export class RegistrationMailCommand {
  constructor(public code: string) {}
}

@CommandHandler(RegistrationMailCommand)
export class RegistrationMailUseCase
  implements ICommandHandler<RegistrationMailCommand, InterlayerNotice<boolean>>
{
  constructor(
    private usersQueryRepository: UsersQueryRepo,
    private usersRepository: UsersRepository,
  ) {}

  async execute(
    command: RegistrationMailCommand,
  ): Promise<InterlayerNotice<boolean>> {
    const notice = new InterlayerNotice<boolean>();

    const user = await this.usersQueryRepository.getUserByConfirmCode(
      command.code,
    );
    const confirm = await this.usersRepository.confirmMail(user.id);
    if (!confirm) {
      notice.addError('error BD', 'error', ERRORS_CODE.ERROR);
      return notice;
    }
    notice.addData(true);
    return notice;
  }
}
