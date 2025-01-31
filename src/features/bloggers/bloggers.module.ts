import { Module } from '@nestjs/common';
import { BloggersController } from './api/bloggers.controller';

@Module({
  controllers: [BloggersController],
})
export class BloggersModule {}
