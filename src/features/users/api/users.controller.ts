import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { createUserInput } from './input/create.user.input';
import { CreateUserCommand } from './useCase/create.user.usecase';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../base/models/inter.layer';
import { OutputUsersType } from './output/user.output';
import { AdminAuthGuard } from '../../../guards/admin-auth-guard.service';
import { GetAllUsersCommand } from './useCase/get.all.users.usecase';
import { GetAllUsersSortData } from './types/get.all.users.sort.data';
import { Pagination } from '../../../base/types/pagination';
import { SortDirectionPipe } from '../../../base/pipes/sort.direction.pipe';

@Controller('sa/users')
export class UsersController {
  constructor(
    protected commandBus: CommandBus,
    protected queryBus: QueryBus,
  ) {}
  @HttpCode(201)
  @UseGuards(AdminAuthGuard)
  @Post()
  async createUser(@Body() data: createUserInput) {
    const command = new CreateUserCommand(
      data.login,
      data.email,
      data.password,
    );
    const res = await this.commandBus.execute<
      CreateUserCommand,
      InterlayerNotice<OutputUsersType>
    >(command);
    return res.execute();
  }
  @UsePipes(SortDirectionPipe)
  @Get()
  async getAllUsers(@Query() data: GetAllUsersSortData) {
    const command = new GetAllUsersCommand(data);
    const res = await this.queryBus.execute<
      GetAllUsersCommand,
      InterlayerNotice<Pagination<OutputUsersType[]>>
    >(command);
    return res.execute();
  }
}
