import { Body, Controller, Post } from '@nestjs/common';
import { createUserInput } from './input/create.user.input';
@Controller('sa/users')
export class UsersController {
  @Post()
  async createUser(@Body() data: createUserInput) {
    return;
  }
}
