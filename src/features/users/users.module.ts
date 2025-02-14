import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersQueryRepo } from './infrastructure/users.query.repository';
import { UsersRepository } from './infrastructure/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { CreateUserUseCase } from './api/useCase/create.user.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { MyJwtService } from '../auth/infrastructure/my.jwt.service';
import { JwtService } from '@nestjs/jwt';
import { EmailConfirmation } from './domain/emailConfirmation';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User, EmailConfirmation])],
  controllers: [UsersController],
  providers: [
    UsersQueryRepo,
    UsersRepository,
    CreateUserUseCase,
    MyJwtService,
    JwtService,
  ],
  exports: [UsersQueryRepo, UsersRepository],
})
export class UsersModule {}
