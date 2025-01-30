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
  async getUserByLoginOrEmail(loginOrEmail: string) {
    const user = await this.usersRepository.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
    return user;
  }
}
