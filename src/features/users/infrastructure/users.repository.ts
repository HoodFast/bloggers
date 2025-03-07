import { CreateUserType } from "./types/create.user.type";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../domain/user.entity";
import { Repository } from "typeorm";
import { OutputUsersType } from "../api/output/user.output";
import { outputUserMapper } from "./mappers/output.user.mapper";
import { MyJwtService } from "../../auth/infrastructure/my.jwt.service";
import bcrypt from "bcryptjs";
import { EmailConfirmation } from "../domain/emailConfirmation";
import { add } from "date-fns/add";

export class UsersRepository {
  constructor(
    @InjectRepository(User) protected usersRepository: Repository<User>,
    @InjectRepository(EmailConfirmation)
    protected emailConfirmationRepository: Repository<EmailConfirmation>,
    protected myJwtService: MyJwtService
  ) {
  }

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

      const mail = new EmailConfirmation();
      mail.userId = save.id;
      mail.user = user;
      mail.isConfirmed = false;
      mail.expirationDate = add(new Date(), {
        minutes: 15
      });
      mail.confirmationCode = crypto.randomUUID();

      const saveMail = await this.emailConfirmationRepository.save<EmailConfirmation>(mail);
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
    try {
      const res = await this.emailConfirmationRepository
        .createQueryBuilder("email")
        .leftJoinAndSelect("email.user", "user")
        .where("user.email = :email", { email })
        .getOne();

      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) return null;
      return user;
    } catch (e) {
      console.log(e);

      return null;
    }

  }

  async addRecoveryCode(id: string, recoveryCode: string) {
    const updateCode = await this.usersRepository.update(id, {
      recoveryCode: recoveryCode
    });
    return updateCode.affected > 0;
  }

  async getUserByRecoveryCode(code: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { recoveryCode: code }
    });
    if (!user) return null;
    return user;
  }

  async changePassword(id: string, newPassword: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);
    const update = await this.usersRepository.update(id, {
      _passwordHash: hash
    });
    return update.affected > 0;
  }

  async confirmMail(userId: string) {
    try {
      const result = await this.usersRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.emailConfirmation", "emailConfirmation")
        .where("user.id = :userId", { userId })
        .update("emailConfirmation", { isConfirmed: true })
        .execute();
      return !!result.affected;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
