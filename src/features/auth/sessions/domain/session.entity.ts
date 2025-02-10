import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users/domain/user.entity';

@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  iat: Date;
  @Column()
  expireDate: Date;
  @Column()
  deviceId: string;
  @Column()
  ip: string;
  @Column({ nullable: true })
  title: string;
  @ManyToOne(() => User, (User) => User.id, {
    onDelete: 'CASCADE',
  })
  user: User;
  @Column()
  userId: string;
}
