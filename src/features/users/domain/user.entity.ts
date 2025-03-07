import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmailConfirmation } from './emailConfirmation';
import { Blog } from '../../bloggers/domain/blog.entity';
import { PostLikes } from '../../posts/domain/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  _passwordHash: string;
  @Column({ length: 10 })
  login: string;
  @Column()
  email: string;
  @Column()
  createdAt: Date;
  @Column({ nullable: true })
  recoveryCode: string;

  @OneToOne(() => EmailConfirmation)
  emailConfirmation: EmailConfirmation;
  @OneToMany(() => Blog, (blog) => blog.owner, { onDelete: 'CASCADE' })
  blog: Blog[];
  @OneToMany(() => PostLikes, (postLikes) => postLikes.user)
  postLikes: PostLikes[];
}
