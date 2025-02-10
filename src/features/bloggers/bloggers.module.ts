import { Module } from '@nestjs/common';
import { BloggersController } from './api/bloggers.controller';
import { CommandBus } from '@nestjs/cqrs';

@Module({
  controllers: [BloggersController],
  providers: [CommandBus],
})
export class BloggersModule {}
