import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
@Entity()
export class EmailConfirmation {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  confirmationCode: string;
  @Column()
  expirationDate: Date;
  @Column('boolean')
  isConfirmed: boolean;
  @Column()
  userId: string;
  @JoinColumn({ name: 'userId' })
  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;
}
