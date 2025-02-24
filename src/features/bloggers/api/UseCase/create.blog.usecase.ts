import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ERRORS_CODE,
  InterlayerNotice,
} from '../../../../base/models/inter.layer';
import { createBlogInput } from '../input/create.blog.input.type';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogViewModel } from '../output/blog.view.model';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query.repository';

export class CreateBlogCommand {
  constructor(public data: createBlogInput) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase
  implements ICommandHandler<CreateBlogCommand, InterlayerNotice<BlogViewModel>>
{
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute(
    command: CreateBlogCommand,
  ): Promise<InterlayerNotice<BlogViewModel>> {
    const notice = new InterlayerNotice<BlogViewModel>();

    const createdAt = new Date();
    const createData: Omit<BlogViewModel, 'id'> = {
      name: command.data.name,
      createdAt,
      description: command.data.description,
      websiteUrl: command.data.websiteUrl,
      isMembership: true,
    };
    const createdBlog = await this.blogsRepository.createBlog(createData);
    if (!createdBlog) {
      notice.addError('error BD', 'error', ERRORS_CODE.ERROR);
      return notice;
    }
    const blog = await this.blogsQueryRepository.getBlog(createdBlog);
    if (!blog) {
      notice.addError('error BD', 'error', ERRORS_CODE.ERROR);
      return notice;
    }
    notice.addData(blog);
    return notice;
  }
}
