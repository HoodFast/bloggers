import { Module } from '@nestjs/common';
import { BloggersController } from './api/bloggers.controller';
import { CommandBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, PostLikes } from '../posts/domain/post.entity';
import { Blog } from './domain/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Blog, PostLikes])],
  controllers: [BloggersController],
  providers: [CommandBus],
})
export class BloggersModule {}
