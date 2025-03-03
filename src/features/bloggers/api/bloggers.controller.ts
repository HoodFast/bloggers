import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../../../guards/admin-auth-guard.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBlogInput } from './input/get.all.blog.input.type';
import { GetAllBlogsCommand } from './UseCase/get.all.blogs.usecase';
import { InterlayerNotice } from '../../../base/models/inter.layer';
import { Pagination } from '../../../base/types/pagination';
import { BlogViewModel } from './output/blog.view.model';
import { GetBlogCommand } from './UseCase/get.blog.usecase';
import { GetAllPostForOutput } from './output/get.all.post.output.type';
import { GetAllPostsForBlogCommand } from './UseCase/get.posts.for.blog';

@Controller('blogs')
export class BloggersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAllBlogs(@Query() data: GetBlogInput) {
    debugger;
    const command = new GetAllBlogsCommand(data, false);
    const res = await this.queryBus.execute<
      GetAllBlogsCommand,
      InterlayerNotice<Pagination<BlogViewModel[]>>
    >(command);
    return res.execute();
  }
  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    const res = await this.queryBus.execute<
      GetBlogCommand,
      InterlayerNotice<BlogViewModel>
    >(new GetBlogCommand(id));
    return res.execute();
  }
  @Get(':id/posts')
  async getAllPostsByBlog(
    @Param('id') id: string,
    @Query() data: GetAllPostsForBlogCommand,
  ) {
    const res = await this.commandBus.execute<
      GetAllPostsForBlogCommand,
      InterlayerNotice<Pagination<GetAllPostForOutput[]>>
    >(new GetAllPostsForBlogCommand(data, id));
    return res.execute();
  }
}
