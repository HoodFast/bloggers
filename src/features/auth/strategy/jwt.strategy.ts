import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SessionQueryRepository } from '../sessions/infrastructure/session.query.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private sessionQueryRepository: SessionQueryRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('AC_SECRET'),
    });
  }

  async validate(payload: any) {
    const session = await this.sessionQueryRepository.getSessionByUserIdAndIat(
      payload.userId,
      payload.iat,
    );
    if (!session) {
      throw new UnauthorizedException();
    }
    return payload.userId;
  }
}
