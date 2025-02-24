import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../../base/models/inter.layer';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query.repository';
import { BlogViewModel } from '../output/blog.view.model';

export class GetBlogCommand {
  constructor(public blogId: string) {}
}

@QueryHandler(GetBlogCommand)
export class GetBlogUseCase
  implements IQueryHandler<GetBlogCommand, InterlayerNotice<BlogViewModel>>
{
  constructor(private blogQueryRepository: BlogsQueryRepository) {}

  async execute(
    command: GetBlogCommand,
  ): Promise<InterlayerNotice<BlogViewModel>> {
    const notice = new InterlayerNotice<BlogViewModel>();

    const result = await this.blogQueryRepository.getBlog(command.blogId);

    if (!result) {
      notice.addError('blogs not found', 'error', 404);
      return notice;
    }
    notice.addData(result);
    return notice;
  }
}
