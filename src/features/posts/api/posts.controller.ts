import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../../../guards/admin-auth-guard.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllBlogsCommand } from './UseCase/get.all.blogs.usecase';
import { InterlayerNotice } from '../../../base/models/inter.layer';
import { Pagination } from '../../../base/types/pagination';
import { BlogViewModel } from './output/blog.view.model';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AdminAuthGuard)
@Controller('posts')
export class BloggersSaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/comments')
  async getAllCommentsForPost(@Param('id') id: string) {
    const command = new GetAllCommentsForPostCommand(data);
    const res = await this.queryBus.execute<
      GetAllBlogsCommand,
      InterlayerNotice<Pagination<BlogViewModel[]>>
    >(command);
    return res.execute();
  }
}
