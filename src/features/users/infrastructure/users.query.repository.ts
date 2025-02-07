import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Repository } from 'typeorm';
import { OutputUsersType } from '../api/output/user.output';
import { outputUserMapper } from './mappers/output.user.mapper';

export class UsersQueryRepo {
  constructor(
    @InjectRepository(User) protected usersRepository: Repository<User>,
  ) {}
  async getUserById(id: string) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    return user;
  }
  async getUserByLoginOrEmail(loginOrEmail: string): Promise<OutputUsersType> {
    const user = await this.usersRepository.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
    return outputUserMapper(user);
  }
}
