import { CommandBus } from '@nestjs/cqrs';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginCommand } from './useCase/login.usecase';
import { InterlayerNotice } from '../../../base/models/inter.layer';
import { LoginOutput } from '../../users/api/output/login.output';
import { Request, Response } from 'express';
import { RecoveryPasswordCommand } from './useCase/recovery.password.usecase';
import { InputChangePasswordType } from './input/input.change.password';
import { ChangePasswordCommand } from './useCase/change.password.usecase';
import { GenerateRefreshTokensPairCommand } from './useCase/generate.refresh.tokens.pair.usecase';
import { RegistrationMailCommand } from './useCase/registration.mail.usecase';
import { InputRegistrationUser } from './input/input.registration.user';
import { RegistrationCommand } from './useCase/registration.user.usecase';
import { LogoutCommand } from './useCase/logout.usecase';
import { ThrottlerGuard } from '@nestjs/throttler';
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(protected commandBus: CommandBus) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ) {
    const title = req.get('User-Agent') || 'none title';
    const command = new LoginCommand({ ...req.user, title, ip });

    const result = await this.commandBus.execute<
      LoginCommand,
      InterlayerNotice<LoginOutput>
    >(command);
    res.cookie('refreshToken', result.data.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    if (result.hasError()) {
      result.execute();
    }
    return { accessToken: result.data.accessToken };
  }

  @Post('password-recovery')
  async recoveryPassword(@Body() email: string) {
    const command = new RecoveryPasswordCommand(email);
    const res = await this.commandBus.execute<
      RecoveryPasswordCommand,
      InterlayerNotice<boolean>
    >(command);
    return res.execute();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('new-password')
  async newPassword(@Body() data: InputChangePasswordType) {
    const command = new ChangePasswordCommand(
      data.newPassword,
      data.recoveryCode,
    );
    const res = await this.commandBus.execute<
      ChangePasswordCommand,
      InterlayerNotice<boolean>
    >(command);
    return res.execute();
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies.refreshToken;
    const command = new GenerateRefreshTokensPairCommand(token);
    const result = await this.commandBus.execute<
      GenerateRefreshTokensPairCommand,
      InterlayerNotice<LoginOutput>
    >(command);
    res.cookie('refreshToken', result.data.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: result.data.accessToken };
  }
  @Post('registration-confirmation')
  async registrationMail(@Body() code: string) {
    const command = new RegistrationMailCommand(code);
    const res = await this.commandBus.execute<
      RegistrationMailCommand,
      InterlayerNotice<boolean>
    >(command);
    return res.execute();
  }
  @Post('registration')
  async registrationUser(@Body() data: InputRegistrationUser) {
    const command = new RegistrationCommand(data);
    const res = await this.commandBus.execute<
      RegistrationCommand,
      InterlayerNotice<boolean>
    >(command);
    return res.execute();
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: Request) {
    const token = req.cookies.refreshToken;

    const command = new LogoutCommand(token);
    const res = await this.commandBus.execute<
      LogoutCommand,
      InterlayerNotice<boolean>
    >(command);
    res.execute();
  }
}
