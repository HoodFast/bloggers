import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
