import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Interaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  actorUsername: string;

  @Column()
  receiverUsername: string;

  @Column()
  state: 'subscribed' | 'unsubscribed';

  @Column()
  viewed: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
