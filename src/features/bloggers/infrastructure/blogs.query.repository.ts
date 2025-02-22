import { GetBlogInput } from '../api/input/get.all.blog.input.type';
import { Pagination } from '../../../base/types/pagination';
import { BlogViewModel } from '../api/output/blog.view.model';
import { Repository } from 'typeorm';
import { Blog } from '../domain/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { blogsViewMapper } from './mappers/blogViewMApper';

export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
  ) {}
  async getAllBlogs(data: GetBlogInput): Promise<Pagination<BlogViewModel>> {
    console.log(data);
    const res: any = await this.blogsRepository
      .createQueryBuilder('blogs')
      .limit();
    return {
      pagesCount: 0,
      page: data.pageNumber,
      pageSize: data.pageSize,
      totalCount: 0,
      items: res.items.map(blogsViewMapper),
    };
  }
}
