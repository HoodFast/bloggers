import { Repository } from 'typeorm';
import { Blog } from '../domain/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogViewModel } from '../api/output/blog.view.model';

export class BlogsRepository {
  constructor(
    @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
  ) {}
  async createBlog(data: Omit<BlogViewModel, 'id'>) {
    const { name, createdAt, websiteUrl, isMembership, description } = data;
    const blog = new Blog();
    blog.name = name;
    blog.createdAt = createdAt;
    blog.description = description;
    blog.websiteUrl = websiteUrl;
    blog.isMembership = isMembership;
    const res = await this.blogsRepository.save(blog);
    return res.id;
  }
}
