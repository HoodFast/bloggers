import { CreateUserType } from './types/create.user.type';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Repository } from 'typeorm';
import { OutputUsersType } from '../api/output/user.output';
import { outputUserMapper } from './mappers/output.user.mapper';

export class UsersRepo {
  constructor(
    @InjectRepository(User) protected usersRepository: Repository<User>,
  ) {}
  async createUser(data: CreateUserType): Promise<OutputUsersType | null> {
    try {
      const user = new User();
      user.createdAt = data.createdAt;
      user._passwordHash = data._passwordHash;
      user.email = data.email;
      user.login = data.login;
      const save = await this.usersRepository.save<User>(user);
      return outputUserMapper(save);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  async checkExistLogin(login: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { login } });
    return !!user;
  }
  async checkExistEmail(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return !!user;
  }
}
