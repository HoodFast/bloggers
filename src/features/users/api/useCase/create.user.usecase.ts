import { OutputUsersType } from '../output/user.output';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../../base/models/inter.layer';
import { UsersRepo } from '../../infrastructure/users.repository';
import { UsersQueryRepo } from '../../infrastructure/users.query.repository';
import { CreateUserType } from '../../infrastructure/types/create.user.type';
import * as bcrypt from 'bcrypt';
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
    private usersSqlRepository: UsersRepo,
    private usersSqlQueryRepository: UsersQueryRepo,
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
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(command.password, salt);
    const createData: CreateUserType = {
      _passwordHash: hash,
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
