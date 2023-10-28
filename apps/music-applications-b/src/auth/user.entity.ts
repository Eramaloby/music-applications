import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Like } from '../likes/like.entity';
import { Task } from '../task/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'date' })
  dateOfBirth: string;

  @Column()
  gender: string;

  @Column()
  relationshipsAddedCount: number;

  @Column()
  nodesAddedCount: number;

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
 
  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @Column()
  pictureBase64: string;
}
