import { GetBlogInput } from '../api/input/get.all.blog.input.type';
import { Pagination } from '../../../base/types/pagination';
import { BlogViewModel } from '../api/output/blog.view.model';

export class BlogsQueryRepository {
  async getAllBlogs(data: GetBlogInput): Promise<Pagination<BlogViewModel>> {
    console.log(data);
    const res: any = 'ok';
    return res;
  }
}
