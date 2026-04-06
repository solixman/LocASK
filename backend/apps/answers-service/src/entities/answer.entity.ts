import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  content!: string;

  @Column('uuid', { nullable: true })
  userId?: string;

  @ManyToOne(() => User, (user) => user.answers, { eager: true, cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  questionId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}