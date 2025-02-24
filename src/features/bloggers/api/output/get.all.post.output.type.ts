import { likeStatuses } from '../../../posts/domain/post.entity';

export class GetAllPostForOutput {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: ExtendedLikesInfo;
}

export class ExtendedLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: likeStatuses;
  newestLikes: newestLikes[];
}

export class newestLikes {
  addedAt: Date;
  userId: string;
  login: string;
}
