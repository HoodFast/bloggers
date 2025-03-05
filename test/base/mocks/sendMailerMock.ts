import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailServiceMock {
  async sendEmail(
    email: string,
    subject: string,
    message: string,
  ): Promise<boolean> {
    return true;
  }
}
