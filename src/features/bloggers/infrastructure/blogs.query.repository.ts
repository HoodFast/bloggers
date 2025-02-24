import { GetBlogInput } from '../api/input/get.all.blog.input.type';
import { Pagination } from '../../../base/types/pagination';
import { BlogViewModelSA } from '../api/output/blog.view.model.SA';
import { Repository } from 'typeorm';
import { Blog } from '../domain/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogsViewMapper, SAblogsViewMapper } from './mappers/blogViewMapper';
import { BlogViewModel } from '../api/output/blog.view.model';

export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
  ) {}
  async getAllBlogsForSA(
    data: GetBlogInput,
    controlSA: boolean,
  ): Promise<Pagination<BlogViewModelSA[] | BlogViewModel[]>> {
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
    const items = controlSA
      ? res[0].map(SAblogsViewMapper)
      : res[0].map(BlogsViewMapper);
    return {
      pagesCount,
      page: data.pageNumber,
      pageSize: data.pageSize,
      totalCount: 0,
      items: items,
    };
  }
  async getBlog(id: string) {
    try {
      const res = await this.blogsRepository.findOne({ where: { id } });
      return BlogsViewMapper(res);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
