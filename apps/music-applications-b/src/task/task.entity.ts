import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @Column()
  successful: boolean;

  @Column()
  reason: string;

  @Column()
  details: string;

  @Column()
  targetRecordId: string;

  @Column()
  targetRecordType: string;

  @Column()
  relationshipCount: number;
}
