import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
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
    debugger;
    const date = new Date(payload.iat * 1000);
    const session = await this.sessionQueryRepository.getSessionByUserIdAndIat(
      payload.userId,
      payload.iat,
    );
    debugger;
    return payload.userId;
  }
}
