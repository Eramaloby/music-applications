export class InteractionDto {
  actorUsername: string;

  receiverUsername: string;

  state: 'subscribed' | 'unsubscribed';

  viewed: boolean;
}
