import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Repository } from 'typeorm';

export class UsersQueryRepo {
  constructor(
    @InjectRepository(User) protected usersRepository: Repository<User>,
  ) {}
  async getUserById(id: string) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    return user;
  }
  async getUserByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
    return user;
  }
  async getUserByConfirmCode(code: string) {
    const res = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.emailConfirmation', 'emailConfirmation')
      .where('emailConfirmation.confirmationCode = :code', { code })
      .getOne();
    return res;
  }
}
