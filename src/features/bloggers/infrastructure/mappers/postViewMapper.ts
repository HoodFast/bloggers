import { likeStatuses, Post } from '../../../posts/domain/post.entity';
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
    extendedLikesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: likeStatuses.none,
      newestLikes: [
        {
          addedAt: new Date(),
          userId: '',
          login: '',
        },
      ],
    },
  };
};
