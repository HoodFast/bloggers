import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../../guards/auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBlogInput } from './input/get.all.blog.input.type';
import { GetAllBlogsCommand } from './UseCase/get.all.blogs.usecase';
import { InterlayerNotice } from '../../../base/models/inter.layer';
import { Pagination } from '../../../base/types/pagination';
import { BlogViewModelSA } from './output/blog.view.model.SA';
import { createBlogInput } from './input/create.blog.input.type';
import { CreateBlogCommand } from './UseCase/create.blog.usecase';
import { BlogViewModel } from './output/blog.view.model';
import { GetBlogCommand } from './UseCase/get.blog.usecase';
import { GetAllPostForOutput } from './output/get.all.post.output.type';
import {
  GetAllPostsForBlog,
  GetAllPostsForBlogCommand,
} from './UseCase/get.posts.for.blog';
@UseGuards(AuthGuard)
@Controller('blogs')
export class BloggersSaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAllBlogs(@Query() data: GetBlogInput) {
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
  async getAllPostsByBlog(@Param('id') id: string) {
    const res = await this.commandBus.execute<
      GetAllPostsForBlog,
      InterlayerNotice<Pagination<GetAllPostForOutput[]>>
    >(new GetAllPostsForBlogCommand());
    return;
  }
}
