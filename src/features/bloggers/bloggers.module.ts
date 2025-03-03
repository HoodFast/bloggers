import { Module } from '@nestjs/common';
import { BloggersSaController } from './api/bloggers.sa.controller';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, PostLikes } from '../posts/domain/post.entity';
import { Blog } from './domain/blog.entity';
import { CreateBlogUseCase } from './api/UseCase/create.blog.usecase';
import { GetAllBlogUseCase } from './api/UseCase/get.all.blogs.usecase';
import { GetBlogUseCase } from './api/UseCase/get.blog.usecase';
import { GetAllPostsForBlogUseCase } from './api/UseCase/get.posts.for.blog';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { BlogsQueryRepository } from './infrastructure/blogs.query.repository';
import { PostsQueryRepository } from '../posts/infrastructure/posts.query.repository';
import { BloggersController } from './api/bloggers.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Post, Blog, PostLikes])],
  controllers: [BloggersSaController, BloggersController],
  providers: [
    PostsQueryRepository,
    BlogsRepository,
    BlogsQueryRepository,
    CreateBlogUseCase,
    GetAllBlogUseCase,
    GetBlogUseCase,
    GetAllPostsForBlogUseCase,
  ],
})
export class BloggersModule {}
