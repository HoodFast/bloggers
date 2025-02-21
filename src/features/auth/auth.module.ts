import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { UsersModule } from '../users/users.module';
import { SessionsService } from './sessions/application/sessions.service';
import { AuthController } from './api/auth.controller';
import { LoginUseCase } from './api/useCase/login.usecase';
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
import { RegistrationUseCase } from './api/useCase/registration.user.usecase';
import { LogoutUseCase } from './api/useCase/logout.usecase';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    UsersModule,
    CqrsModule,
    TypeOrmModule.forFeature([Session]),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 2,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    SessionQueryRepository,
    LogoutUseCase,
    RegistrationUseCase,
    EmailService,
    RegistrationMailUseCase,
    ChangePasswordUseCase,
    RecoveryUseCase,
    SessionRepository,
    LoginUseCase,
    AuthService,
    SessionsService,
    LocalStrategy,
    JwtService,
  ],
})
export class AuthModule {}
