import { Module } from '@nestjs/common';
import { BloggersSaController } from './api/bloggers.sa.controller';
import { CommandBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, PostLikes } from '../posts/domain/post.entity';
import { Blog } from './domain/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Blog, PostLikes])],
  controllers: [BloggersSaController],
  providers: [CommandBus],
})
export class BloggersModule {}
