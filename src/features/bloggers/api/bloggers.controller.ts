import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards/auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { GetBlogInput } from './input/get.all.blog.input.type';
import { GetAllBlogsCommand } from './UseCase/get.all.blogs.usecase';
import { InterlayerNotice } from '../../../base/models/inter.layer';
import { Pagination } from '../../../base/types/pagination';
import { BlogViewModel } from './output/blog.view.model';
@UseGuards(AuthGuard)
@Controller('sa/blogs')
export class BloggersController {
  constructor(private readonly commandBus: CommandBus) {}
  @Get()
  async getAllBlogs(@Query() data: GetBlogInput) {
    const command = new GetAllBlogsCommand(data);
    const res = await this.commandBus.execute<
      GetAllBlogsCommand,
      InterlayerNotice<Pagination<BlogViewModel>>
    >(command);
    return res.execute();
  }
  async bindBlogWithUser() {}
}
