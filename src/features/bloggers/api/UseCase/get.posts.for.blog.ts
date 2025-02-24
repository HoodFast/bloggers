import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../../base/models/inter.layer';
import { GetBlogInput } from '../input/get.all.blog.input.type';
import { SortDirection } from '../../../../base/enum/sortBy.enum';
import { Pagination } from '../../../../base/types/pagination';
import { BlogViewModelSA } from '../output/blog.view.model.SA';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query.repository';
import { BlogViewModel } from '../output/blog.view.model';
import { GetAllPostForOutput } from "../output/get.all.post.output.type";
import { PostsQueryRepository } from "../../../posts/infrastructure/posts.query.repository";

export class GetAllPostsForBlog{
  public data:any
    public blogId: string,

  ) {}
}

@QueryHandler(GetAllPostsForBlog)
export class GetAllBlogUseCase
  implements
    IQueryHandler<
      GetAllPostsForBlog,
      InterlayerNotice<Pagination<GetAllPostForOutput>>
    >
{
  constructor(private postQueryRepository: PostsQueryRepository) {}

  async execute(
    command: GetAllPostsForBlog,
  ): Promise<
    InterlayerNotice<Pagination<GetAllPostForOutput>>
  > {
    const notice = new InterlayerNotice<
      Pagination<GetAllPostForOutput>
    >();
    const sortData: GetBlogInput = {
      searchNameTerm: command.data.searchNameTerm ?? '',
      sortBy: command.data.sortBy ?? 'createdAt',
      sortDirection: command.data.sortDirection ?? SortDirection.desc,
      pageNumber: command.data.pageNumber
        ? +command.data.pageNumber
        : 1,
      pageSize: command.data.pageSize ? +command.data.pageSize : 10,
    };
    const result = await this.postQueryRepository.getAllPotForBlog(
      command.blogId
    );

    if (!result) {
      notice.addError('blogs not found', 'error', 404);
      return notice;
    }
    notice.addData(result);
    return notice;
  }
}
