import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/domain/user.entity';
import { Post } from '../../posts/domain/post.entity';
@Entity()
export class Blog extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  websiteUrl: string;
  @Column()
  createdAt: Date;
  @Column({ nullable: true })
  isMembership: boolean;
  @ManyToOne(() => User, (user) => user.blog, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  owner: User;
  @Column({ nullable: true })
  ownerId: string;
  @OneToMany(() => Post, (post) => post.blog, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  posts: Post[];
}
