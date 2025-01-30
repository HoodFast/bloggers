import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersQueryRepo } from './infrastructure/users.query.repository';
import { UsersRepo } from './infrastructure/users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersQueryRepo, UsersRepo],
  exports: [UsersQueryRepo],
})
export class UsersModule {}
