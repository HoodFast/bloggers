import { GetBlogInput } from '../api/input/get.all.blog.input.type';
import { Pagination } from '../../../base/types/pagination';
import { BlogViewModelSA } from '../api/output/blog.view.model.SA';
import { Repository } from 'typeorm';
import { Blog } from '../domain/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogsViewMapper, SAblogsViewMapper } from './mappers/blogViewMapper';

export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
  ) {}
  async getAllBlogsForSA(
    data: GetBlogInput,
  ): Promise<Pagination<BlogViewModelSA[]>> {
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
      items: res[0].map(SAblogsViewMapper),
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
