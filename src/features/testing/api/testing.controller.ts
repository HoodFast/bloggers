import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingRepository } from '../infrastructure/testing.repository';

@Controller('testing/all-data')
export class TestingController {
  constructor(private testingQueryRepository: TestingRepository) {}

  @HttpCode(204)
  @Delete()
  async deleteAll() {
    await this.testingQueryRepository.deleteAll();
    return;
  }
}
