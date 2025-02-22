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
  async getAllBlogs(data: GetBlogInput): Promise<Pagination<BlogViewModel[]>> {
    const { sortBy, sortDirection, searchNameTerm, pageSize, pageNumber } =
      data;
    const offset = (pageNumber - 1) * pageSize;

    const res = await this.blogsRepository
      .createQueryBuilder('blog')
      .where('blog.name ILIKE :searchLoginTerm ', {
        searchLoginTerm: `%${searchNameTerm}%`,
      })
      .orderBy(`blog.${sortBy}`, sortDirection)
      .skip(offset)
      .take(pageSize)
      .leftJoinAndSelect('blog.owner', 'owner')
      .getManyAndCount();

    const pagesCount = Math.ceil(res[1] / pageSize);
    return {
      pagesCount,
      page: data.pageNumber,
      pageSize: data.pageSize,
      totalCount: 0,
      items: res[0].map(blogsViewMapper),
    };
  }
}
