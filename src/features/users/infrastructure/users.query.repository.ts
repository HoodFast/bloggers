import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Repository } from 'typeorm';
import { Pagination } from '../../../base/types/pagination';
import { OutputUsersType } from '../api/output/user.output';
import { GetAllUsersSortData } from '../api/types/get.all.users.sort.data';
import { skip } from 'rxjs';

export class UsersQueryRepository {
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
  async getAllUsers(
    data: GetAllUsersSortData,
  ): Promise<Pagination<OutputUsersType[]>> {
    const {
      searchEmailTerm,
      searchLoginTerm,
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
    } = data;
    const skip = (pageNumber - 1) * pageSize;
    const queryBuilder = await this.usersRepository.createQueryBuilder('user');
    const totalCount = await queryBuilder.getMany();
    if (searchLoginTerm) {
      queryBuilder.andWhere('user.login ILIKE :searchLoginTerm', {
        searchLoginTerm: `%${searchLoginTerm}%`,
      });
    }
    if (searchEmailTerm) {
      queryBuilder.andWhere('user.email ILIKE :searchEmailTerm', {
        searchEmailTerm: `%${searchEmailTerm}%`,
      });
    }

    queryBuilder
      .orderBy(`user.${sortBy}`, sortDirection)
      .skip(skip)
      .take(pageSize);

    const res: any = await queryBuilder.getMany();
    debugger;
    const pagesCount = Math.ceil(totalCount.length / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount: totalCount.length,
      items: res,
    };
  }
}
