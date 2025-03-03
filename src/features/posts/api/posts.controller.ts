import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../../../guards/admin-auth-guard.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
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
    // const command = new GetAllCommentsForPostCommand(data);

    return true;
  }
}
