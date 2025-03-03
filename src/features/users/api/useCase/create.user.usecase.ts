import { OutputUsersType } from '../output/user.output';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../../base/models/inter.layer';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UsersQueryRepository } from '../../infrastructure/users.query.repository';
import { CreateUserType } from '../../infrastructure/types/create.user.type';

export class CreateUserCommand {
  constructor(
    public login: string,
    public email: string,
    public password: string,
    public isConfirmed?: boolean,
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
  implements
    ICommandHandler<CreateUserCommand, InterlayerNotice<OutputUsersType>>
{
  constructor(
    private usersSqlRepository: UsersRepository,
    private usersSqlQueryRepository: UsersQueryRepository,
  ) {}

  async execute(
    command: CreateUserCommand,
  ): Promise<InterlayerNotice<OutputUsersType>> {
    const notice = new InterlayerNotice<OutputUsersType>();
    const checkUserExistLogin = await this.usersSqlRepository.checkExistLogin(
      command.login,
    );
    if (checkUserExistLogin) {
      notice.addError('user is already exist', 'error', 403);
      return notice;
    }
    const checkUserExistEmail = await this.usersSqlRepository.checkExistEmail(
      command.email,
    );
    if (checkUserExistEmail) {
      notice.addError('email is already exist', 'error', 403);
      return notice;
    }
    const createdAt = new Date();
    const createData: CreateUserType = {
      password: command.password,
      createdAt,
      email: command.email,
      login: command.login,
    };
    const createdUser = await this.usersSqlRepository.createUser(createData);
    if (!createdUser) {
      notice.addError('error BD');
      return notice;
    }
    notice.addData(createdUser);
    return notice;
  }
}
