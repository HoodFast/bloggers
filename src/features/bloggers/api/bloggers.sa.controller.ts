import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../../../guards/admin-auth-guard.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBlogInput } from './input/get.all.blog.input.type';
import { GetAllBlogsCommand } from './UseCase/get.all.blogs.usecase';
import { InterlayerNotice } from '../../../base/models/inter.layer';
import { Pagination } from '../../../base/types/pagination';
import { BlogViewModelSA } from './output/blog.view.model.SA';
import { createBlogInput } from './input/create.blog.input.type';
import { CreateBlogCommand } from './UseCase/create.blog.usecase';
import { BlogViewModel } from './output/blog.view.model';
@UseGuards(AdminAuthGuard)
@Controller('sa/blogs')
export class BloggersSaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createBlog(@Body() data: createBlogInput) {
    const res = await this.commandBus.execute<
      CreateBlogCommand,
      InterlayerNotice<BlogViewModel>
    >(new CreateBlogCommand(data));
    return res.execute();
  }
  @Get()
  async getAllBlogs(@Query() data: GetBlogInput) {
    const command = new GetAllBlogsCommand(data, true);
    const res = await this.queryBus.execute<
      GetAllBlogsCommand,
      InterlayerNotice<Pagination<BlogViewModelSA[]>>
    >(command);
    return res.execute();
  }

  async bindBlogWithUser() {}
}
