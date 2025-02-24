import { Blog } from '../../domain/blog.entity';
import { BlogViewModel } from '../../api/output/blog.view.model';

export const blogsViewMapper = (blog: Blog): BlogViewModel => {
  return {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt.toISOString(),
    isMembership: blog.isMembership,
    blogOwnerInfo: { userId: '', userLogin: '' },
  };
};
