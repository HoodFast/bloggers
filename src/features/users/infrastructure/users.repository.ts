import { CreateUserType } from './types/create.user.type';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Repository } from 'typeorm';

export class UsersRepo {
  constructor(
    @InjectRepository(User) protected usersRepository: Repository<User>,
  ) {}
  async createUser(data: CreateUserType) {
    const user = new User();
    user.createdAt = data.createdAt;
    user._passwordHash = data._passwordHash;
    user.email = data.email;
    user.login = data.login;
    const save = await this.usersRepository.save<User>(user);
    return user;
  }
}
