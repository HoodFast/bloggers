import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ERRORS_CODE,
  InterlayerNotice,
} from '../../../../base/models/inter.layer';

import { LoginOutput } from '../../../users/api/output/login.output';
import { MyJwtService } from '../../infrastructure/my.jwt.service';
import { OutputUsersType } from '../../../users/api/output/user.output';
import { SessionsService } from '../../sessions/application/sessions.service';
import { InputRegistrationUser } from '../input/input.registration.user';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { CreateUserType } from '../../../users/infrastructure/types/create.user.type';
export class RegistrationCommand {
  constructor(public data: InputRegistrationUser) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase
  implements ICommandHandler<RegistrationCommand, InterlayerNotice<boolean>>
{
  constructor(
    private usersRepository: UsersRepository,
    protected sessionService: SessionsService,
  ) {}

  async execute(
    command: RegistrationCommand,
  ): Promise<InterlayerNotice<boolean>> {
    const notice = new InterlayerNotice<boolean>();
    const loginCheck = await this.usersRepository.checkExistLogin(
      command.data.login,
    );
    const mailCheck = await this.usersRepository.checkExistEmail(
      command.data.email,
    );

    if (loginCheck) {
      notice.addError(
        'login is already exist',
        'error',
        ERRORS_CODE.BAD_REQUEST,
      );
      return notice;
    }
    if (mailCheck) {
      notice.addError(
        'email is already exist',
        'error',
        ERRORS_CODE.BAD_REQUEST,
      );
      return notice;
    }
    const createdAt = new Date();
    const data: CreateUserType = {
      createdAt,
      login: command.data.login,
      email: command.data.email,
      password: command.data.password,
    };
    const user = await this.usersRepository.createUser(data);

    if (!user) {
      notice.addError('error BD', 'error', ERRORS_CODE.ERROR);
      return notice;
    }
    notice.addData(true);
    return notice;
  }
}
