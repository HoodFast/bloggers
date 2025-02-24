import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../../base/models/inter.layer';
import { GetBlogInput } from '../input/get.all.blog.input.type';
import { SortDirection } from '../../../../base/enum/sortBy.enum';
import { Pagination } from '../../../../base/types/pagination';
import { BlogViewModelSA } from '../output/blog.view.model.SA';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query.repository';

export class GetAllBlogsCommand {
  constructor(public sortData: GetBlogInput) {}
}

@QueryHandler(GetAllBlogsCommand)
export class GetAllBlogUseCase
  implements
    IQueryHandler<
      GetAllBlogsCommand,
      InterlayerNotice<Pagination<BlogViewModelSA[]>>
    >
{
  constructor(private blogQueryRepository: BlogsQueryRepository) {}

  async execute(
    command: GetAllBlogsCommand,
  ): Promise<InterlayerNotice<Pagination<BlogViewModelSA[]>>> {
    const notice = new InterlayerNotice<Pagination<BlogViewModelSA[]>>();
    const sortData: GetBlogInput = {
      searchNameTerm: command.sortData.searchNameTerm ?? '',
      sortBy: command.sortData.sortBy ?? 'createdAt',
      sortDirection: command.sortData.sortDirection ?? SortDirection.desc,
      pageNumber: command.sortData.pageNumber
        ? +command.sortData.pageNumber
        : 1,
      pageSize: command.sortData.pageSize ? +command.sortData.pageSize : 10,
    };
    const result = await this.blogQueryRepository.getAllBlogsForSA(sortData);

    if (!result) {
      notice.addError('blogs not found', 'error', 404);
      return notice;
    }
    notice.addData(result);
    return notice;
  }
}
