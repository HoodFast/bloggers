import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersQueryRepo } from './infrastructure/users.query.repository';
import { UsersRepository } from './infrastructure/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { CreateUserUseCase } from './api/useCase/create.user.usecase';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersQueryRepo, UsersRepository, CreateUserUseCase],
  exports: [UsersQueryRepo],
})
export class UsersModule {}
