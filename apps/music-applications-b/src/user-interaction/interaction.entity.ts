import { Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
