import { Injectable } from '@nestjs/common';
import { UsersQueryRepo } from '../users/infrastructure/users.query.repository';
import bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private usersQueryRepo: UsersQueryRepo) {}

  async validateUser(loginOrEmail: string, password: string): Promise<any> {
    const user = await this.usersQueryRepo.getUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      return null;
    }
    const res = await bcrypt.compare(password, user._passwordHash);
    if (res) {
      return user.id;
    }
    return null;
  }
}
