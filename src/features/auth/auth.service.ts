import { Injectable } from '@nestjs/common';
import { UsersQueryRepo } from '../users/infrastructure/users.query.repository';
import * as bcrypt from 'bcrypt';
import { outputUserMapper } from '../users/infrastructure/mappers/output.user.mapper';
@Injectable()
export class AuthService {
  constructor(private usersQueryRepo: UsersQueryRepo) {}

  async validate(loginOrEmail: string, password: string): Promise<any> {
    const user = await this.usersQueryRepo.getUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      return null;
    }
    const res = await bcrypt.compare(password, user._passwordHash);

    if (res) {
      return outputUserMapper(user);
    }
    return null;
  }
}
