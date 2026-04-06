import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Like } from './like.entity';
import { User } from './user.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  content!: string;

  @Column('double precision')
  latitude!: number;

  @Column('double precision')
  longitude!: number;

  @Column('uuid', { nullable: true })
  userId?: string;

  @ManyToOne(() => User, (user) => user.questions, { eager: true, cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Like, (like) => like.question)
  likes: Like[];
}