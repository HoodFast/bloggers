import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { MyJwtService } from './features/auth/infrastructure/my.jwt.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly myJwtService: MyJwtService,
  ) {}
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
  @Get('token/:id')
  async getToken(@Param('id') id: string) {
    const token = await this.myJwtService.createPassportJWT(id);
    return token;
  }
}
