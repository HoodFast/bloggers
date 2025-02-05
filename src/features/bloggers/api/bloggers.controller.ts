import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards/auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { GetBlogInput } from './input/get.all.blog.input.type';
import { GetAllBlogsCommand } from './UseCase/get.all.blogs.usecase';
@UseGuards(AuthGuard)
@Controller('sa/blogs')
export class BloggersController {
  constructor(private readonly commandBus: CommandBus) {}
  @Get()
  async getAllBlogs(@Query() data: GetBlogInput) {
    const command = new GetAllBlogsCommand(data);
  }
  async bindBlogWithUser() {}
}
