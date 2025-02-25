import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../domain/post.entity';
import { GetPostForBlogInput } from '../../bloggers/api/input/get.all.posts.for.blog.input.type';
import { GetAllPostForOutput } from '../../bloggers/api/output/get.all.post.output.type';
import { Pagination } from '../../../base/types/pagination';
import { PostsViewMapper } from '../../bloggers/infrastructure/mappers/postViewMapper';

export class PostsQueryRepository {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}
  async getAllPotForBlog(
    data: GetPostForBlogInput,
    id: string,
  ): Promise<Pagination<GetAllPostForOutput[]>> {
    try {
      const { sortBy, sortDirection, pageSize, pageNumber } = data;
      const offset = (pageNumber - 1) * pageSize;
      const res = await this.postsRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.blog', 'blog')
        .where('blog.id = :blogId', { blogId: id })
        .orderBy(`post.${sortBy}`, sortDirection)
        .skip(offset)
        .take(pageSize)
        .getMany();
      const pagesCount = Math.ceil(res.length / pageSize);
      return {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount: res.length,
        items: res.map(PostsViewMapper),
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
