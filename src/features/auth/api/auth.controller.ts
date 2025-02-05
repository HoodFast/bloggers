import { CommandBus } from '@nestjs/cqrs';
import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class UsersController {
  constructor(protected commandBus: CommandBus) {}

  @Post('login')
  async login() {
    return 'you token';
  }
}
