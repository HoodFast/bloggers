import { CommandBus } from '@nestjs/cqrs';
import { Controller, Ip, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginCommand } from './useCase/login.usecase';
import { InterlayerNotice } from '../../../base/models/inter.layer';
import { LoginOutput } from '../../users/api/output/login.output';
import { Response } from 'express';

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
}
