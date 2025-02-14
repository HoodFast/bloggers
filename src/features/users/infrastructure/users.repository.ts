import { CreateUserType } from './types/create.user.type';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Repository } from 'typeorm';
import { OutputUsersType } from '../api/output/user.output';
import { outputUserMapper } from './mappers/output.user.mapper';
import { MyJwtService } from '../../auth/infrastructure/my.jwt.service';
import * as bcrypt from 'bcrypt';

export class UsersRepository {
  constructor(
    @InjectRepository(User) protected usersRepository: Repository<User>,
    protected myJwtService: MyJwtService,
  ) {}
  async createUser(data: CreateUserType): Promise<OutputUsersType | null> {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(data.password, salt);
      const user = new User();
      user.createdAt = data.createdAt;
      user._passwordHash = hash;
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
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) return null;
    return user;
  }
  async addRecoveryCode(id: string, recoveryCode: string) {
    const updateCode = await this.usersRepository.update(id, {
      recoveryCode: recoveryCode,
    });
    return updateCode.affected > 0;
  }
  async getUserByRecoveryCode(code: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { recoveryCode: code },
    });
    if (!user) return null;
    return user;
  }
  async changePassword(id: string, newPassword: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);
    const update = await this.usersRepository.update(id, {
      _passwordHash: hash,
    });
    return update.affected > 0;
  }
  async confirmMail(userId: string) {
    try {
      const result = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.emailConfirmation', 'emailConfirmation')
        .where('user.id = :userId', { userId })
        .update('emailConfirmation', { isConfirmed: true })
        .execute();
      return !!result.affected;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
