import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../../base/models/inter.layer';
import { SortDirection } from '../../../../base/enum/sortBy.enum';
import { Pagination } from '../../../../base/types/pagination';
import { GetAllPostForOutput } from '../output/get.all.post.output.type';
import { PostsQueryRepository } from '../../../posts/infrastructure/posts.query.repository';
import { GetPostForBlogInput } from '../input/get.all.posts.for.blog.input.type';

export class GetAllPostsForBlogCommand {
  constructor(
    public data: any,
    public blogId: string,
  ) {}
}

@QueryHandler(GetAllPostsForBlogCommand)
export class GetAllPostsForBlogUseCase
  implements
    IQueryHandler<
      GetAllPostsForBlogCommand,
      InterlayerNotice<Pagination<GetAllPostForOutput[]>>
    >
{
  constructor(private postQueryRepository: PostsQueryRepository) {}

  async execute(
    command: GetAllPostsForBlogCommand,
  ): Promise<InterlayerNotice<Pagination<GetAllPostForOutput[]>>> {
    const notice = new InterlayerNotice<Pagination<GetAllPostForOutput[]>>();
    const sortData: GetPostForBlogInput = {
      sortBy: command.data.sortBy ?? 'createdAt',
      sortDirection: command.data.sortDirection ?? SortDirection.desc,
      pageNumber: command.data.pageNumber ? +command.data.pageNumber : 1,
      pageSize: command.data.pageSize ? +command.data.pageSize : 10,
    };
    const result = await this.postQueryRepository.getAllPotForBlog(
      sortData,
      command.blogId,
    );

    if (!result) {
      notice.addError('blogs not found', 'error', 404);
      return notice;
    }
    notice.addData(result);
    return notice;
  }
}
