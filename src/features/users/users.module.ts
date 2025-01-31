import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersQueryRepo } from './infrastructure/users.query.repository';
import { UsersRepo } from './infrastructure/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersQueryRepo, UsersRepo],
  exports: [UsersQueryRepo],
})
export class UsersModule {}
