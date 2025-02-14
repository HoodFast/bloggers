import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmailConfirmation } from './emailConfirmation';

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
}
