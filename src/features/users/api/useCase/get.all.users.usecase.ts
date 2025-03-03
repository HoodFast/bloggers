import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../../base/models/inter.layer';
import { SortDirection } from '../../../../base/enum/sortBy.enum';
import { Pagination } from '../../../../base/types/pagination';
import { GetAllUsersSortData } from '../types/get.all.users.sort.data';
import { OutputUsersType } from '../output/user.output';
import { UsersQueryRepository } from '../../infrastructure/users.query.repository';

export class GetAllUsersCommand {
  constructor(
    public sortData: GetAllUsersSortData,
    // public controlSA: boolean,
  ) {}
}

@QueryHandler(GetAllUsersCommand)
export class GetAllUsersUseCase
  implements
    IQueryHandler<
      GetAllUsersCommand,
      InterlayerNotice<Pagination<OutputUsersType[]>>
    >
{
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute(
    command: GetAllUsersCommand,
  ): Promise<InterlayerNotice<Pagination<OutputUsersType[]>>> {
    const notice = new InterlayerNotice<Pagination<OutputUsersType[]>>();
    const sortData: GetAllUsersSortData = {
      searchEmailTerm: command.sortData.searchEmailTerm ?? '',
      searchLoginTerm: command.sortData.searchLoginTerm ?? '',
      sortBy: command.sortData.sortBy ?? 'createdAt',
      sortDirection: command.sortData.sortDirection ?? SortDirection.desc,
      pageNumber: command.sortData.pageNumber
        ? +command.sortData.pageNumber
        : 1,
      pageSize: command.sortData.pageSize ? +command.sortData.pageSize : 10,
    };
    const result = await this.usersQueryRepository.getAllUsers(sortData);

    if (!result) {
      notice.addError('users not found', 'error', 404);
      return notice;
    }
    notice.addData(result);
    return notice;
  }
}
