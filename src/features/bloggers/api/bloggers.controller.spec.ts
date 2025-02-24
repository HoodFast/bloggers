import { Test, TestingModule } from '@nestjs/testing';
import { BloggersSaController } from './bloggers.sa.controller';

describe('BloggersController', () => {
  let controller: BloggersSaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BloggersSaController],
    }).compile();

    controller = module.get<BloggersSaController>(BloggersSaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
