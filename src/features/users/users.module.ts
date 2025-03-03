import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersQueryRepository } from './infrastructure/users.query.repository';
import { UsersRepository } from './infrastructure/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { CreateUserUseCase } from './api/useCase/create.user.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { MyJwtService } from '../auth/infrastructure/my.jwt.service';
import { JwtService } from '@nestjs/jwt';
import { EmailConfirmation } from './domain/emailConfirmation';
import { SessionQueryRepository } from '../auth/sessions/infrastructure/session.query.repository';
import { SessionRepository } from '../auth/sessions/infrastructure/session.repository';
import { Session } from '../auth/sessions/domain/session.entity';
import { GetAllUsersUseCase } from './api/useCase/get.all.users.usecase';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([User, EmailConfirmation, Session]),
  ],
  controllers: [UsersController],
  providers: [
    GetAllUsersUseCase,
    UsersQueryRepository,
    SessionQueryRepository,
    SessionRepository,
    UsersRepository,
    CreateUserUseCase,
    MyJwtService,
    JwtService,
  ],
  exports: [UsersQueryRepository, UsersRepository, MyJwtService],
})
export class UsersModule {}
