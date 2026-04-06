import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from './answer.entity';

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'varchar', nullable: true })
  name?: string | null;

  @Column({ type: 'varchar', nullable: true })
  picture?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];
}
