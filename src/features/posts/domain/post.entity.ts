import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from '../../bloggers/domain/blog.entity';
import { User } from '../../users/domain/user.entity';
@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column()
  shortDescription: string;
  @Column()
  content: string;
  @Column()
  createdAt: Date;
  @ManyToOne(() => Blog, (blog) => blog.posts, { onDelete: 'CASCADE' })
  blog: Blog;
  @OneToMany(() => PostLikes, (postLikes) => postLikes.post)
  likes: PostLikes[];
}

export enum likeStatuses {
  none = 'None',
  like = 'Like',
  dislike = 'Dislike',
}

@Entity()
export class PostLikes extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
  @Column()
  login: string;
  @Column({ type: 'enum', enum: likeStatuses, default: likeStatuses.none })
  status: likeStatuses;
  @ManyToOne(() => User, (user) => user.postLikes)
  user: User;
  @Column()
  userId: string;
  @ManyToOne(() => Post, (post) => post.likes)
  post: Post;
  @Column()
  postId: string;
}
