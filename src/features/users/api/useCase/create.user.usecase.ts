import { OutputUsersType } from '../output/user.output';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../../base/models/inter.layer';
import { UsersRepo } from '../../infrastructure/users.repository';
import { UsersQueryRepo } from '../../infrastructure/users.query.repository';

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
    const checkUserExistLogin = await this.usersSqlRepository.doesExistByLogin(
      command.login,
    );

    if (checkUserExistLogin) {
      notice.addError('user is already exist');
      return notice;
      // throw new BadRequestException('user is already exist', 'login');
    }

    const checkUserExistEmail = await this.usersSqlRepository.doesExistByEmail(
      command.email,
    );

    if (checkUserExistEmail) {
      notice.addError('email is already exist');
      return notice;
      // throw new BadRequestException('email is already exist', 'email');
    }

    const createdAt = new Date();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(command.password, salt);

    const userData = {
      accountData: {
        _passwordHash: hash,
        createdAt,
        email: command.email,
        login: command.login,
      },
      emailConfirmation: {
        confirmationCode: crypto.randomUUID(),
        expirationDate: add(new Date(), {
          minutes: 15,
        }),
        isConfirmed: command.isConfirmed ? command.isConfirmed : false,
      },
      tokensBlackList: [],
    };

    const createdUser = await this.usersSqlRepository.createUser(userData);
    if (!createdUser) {
      notice.addError('error BD');
      return notice;
    }

    if (!command.isConfirmed) {
      await this.sendConfirmCode(createdUser!.email);
    }
    notice.addData(createdUser!);
    return notice;
  }
}
