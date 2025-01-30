import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { createUserInput } from './input/create.user.input';
import { CreateUserCommand } from './useCase/create.user.usecase';
import { CommandBus } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../base/models/inter.layer';
import { OutputUsersType } from './output/user.output';
import { AuthGuard } from '@nestjs/passport';
@Controller('sa/users')
export class UsersController {
  constructor(protected commandBus: CommandBus) {}
  @HttpCode(201)
  @UseGuards(AuthGuard('local;'))
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
}
