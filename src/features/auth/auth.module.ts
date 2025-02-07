import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { UsersModule } from '../users/users.module';
import { SessionsService } from './sessions/application/sessions.service';

@Module({
  imports: [PassportModule, UsersModule],
  controllers: [],
  providers: [AuthService, SessionsService, LocalStrategy],
})
export class AuthModule {}
