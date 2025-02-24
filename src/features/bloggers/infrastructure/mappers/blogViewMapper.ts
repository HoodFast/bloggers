import { Blog } from '../../domain/blog.entity';
import { BlogViewModelSA } from '../../api/output/blog.view.model.SA';
import { BlogViewModel } from '../../api/output/blog.view.model';

export const SAblogsViewMapper = (blog: Blog): BlogViewModelSA => {
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

export const BlogsViewMapper = (blog: Blog): BlogViewModel => {
  return {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};
