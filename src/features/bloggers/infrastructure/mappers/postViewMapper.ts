import { Blog } from '../../domain/blog.entity';
import { BlogViewModel } from '../../api/output/blog.view.model';
import { Post } from '../../../posts/domain/post.entity';
import { GetAllPostForOutput } from '../../api/output/get.all.post.output.type';

export const PostsViewMapper = (post: Post): GetAllPostForOutput => {
  return {
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blog.id,
    blogName: post.blog.name,
    createdAt: post.createdAt,
    extendedLikesInfo: post.likes as any,
  };
};
