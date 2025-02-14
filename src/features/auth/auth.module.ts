import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { UsersModule } from '../users/users.module';
import { SessionsService } from './sessions/application/sessions.service';
import { AuthController } from './api/auth.controller';
import { LoginUseCase } from './api/useCase/login.usecase';
import { MyJwtService } from './infrastructure/my.jwt.service';
import { JwtService } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { SessionQueryRepository } from './sessions/infrastructure/session.query.repository';
import { SessionRepository } from './sessions/infrastructure/session.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './sessions/domain/session.entity';
import { RecoveryUseCase } from './api/useCase/recovery.password.usecase';
import { ChangePasswordUseCase } from './api/useCase/change.password.usecase';
import { EmailService } from './infrastructure/email.service';
import { RegistrationMailUseCase } from './api/useCase/registration.mail.usecase';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    CqrsModule,
    TypeOrmModule.forFeature([Session]),
  ],
  controllers: [AuthController],
  providers: [
    EmailService,
    RegistrationMailUseCase,
    ChangePasswordUseCase,
    RecoveryUseCase,
    SessionQueryRepository,
    SessionRepository,
    LoginUseCase,
    AuthService,
    SessionsService,
    LocalStrategy,
    MyJwtService,
    JwtService,
  ],
})
export class AuthModule {}
