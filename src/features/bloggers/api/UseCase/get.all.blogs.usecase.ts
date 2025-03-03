import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../../base/models/inter.layer';
import { GetBlogInput } from '../input/get.all.blog.input.type';
import { SortDirection } from '../../../../base/enum/sortBy.enum';
import { Pagination } from '../../../../base/types/pagination';
import { BlogViewModelSA } from '../output/blog.view.model.SA';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query.repository';
import { BlogViewModel } from '../output/blog.view.model';

export class GetAllBlogsCommand {
  constructor(
    public sortData: GetBlogInput,
    public controlSA: boolean,
  ) {}
}

@QueryHandler(GetAllBlogsCommand)
export class GetAllBlogUseCase
  implements
    IQueryHandler<
      GetAllBlogsCommand,
      InterlayerNotice<Pagination<BlogViewModelSA[] | BlogViewModel[]>>
    >
{
  constructor(private blogQueryRepository: BlogsQueryRepository) {}

  async execute(
    command: GetAllBlogsCommand,
  ): Promise<
    InterlayerNotice<Pagination<BlogViewModelSA[] | BlogViewModel[]>>
  > {
    debugger;
    const notice = new InterlayerNotice<
      Pagination<BlogViewModelSA[] | BlogViewModel[]>
    >();
    const sortData: GetBlogInput = {
      searchNameTerm: command.sortData.searchNameTerm ?? '',
      sortBy: command.sortData.sortBy ?? 'createdAt',
      sortDirection: command.sortData.sortDirection ?? SortDirection.desc,
      pageNumber: command.sortData.pageNumber
        ? +command.sortData.pageNumber
        : 1,
      pageSize: command.sortData.pageSize ? +command.sortData.pageSize : 10,
    };
    const result = await this.blogQueryRepository.getAllBlogsForSA(
      sortData,
      command.controlSA,
    );

    if (!result) {
      notice.addError('blogs not found', 'error', 404);
      return notice;
    }
    notice.addData(result);
    return notice;
  }
}
