import { CommandBus } from '@nestjs/cqrs';
import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginCommand } from './useCase/login.usecase';
import { InterlayerNotice } from '../../../base/models/inter.layer';
import { LoginOutput } from '../../users/api/output/login.output';
import { Response } from 'express';

@Controller('auth')
export class UsersController {
  constructor(protected commandBus: CommandBus) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    console.log(req.user);
    const command = new LoginCommand(req.user);
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
