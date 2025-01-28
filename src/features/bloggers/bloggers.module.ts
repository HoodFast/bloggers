import { Module } from '@nestjs/common';
import { BloggersController } from './bloggers/bloggers.controller';

@Module({
  controllers: [BloggersController]
})
export class BloggersModule {}
