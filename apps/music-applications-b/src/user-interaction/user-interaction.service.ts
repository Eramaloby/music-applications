import { ConflictException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserInformation } from './user.data';
import { LikeService } from '../likes/like.service';
import { DatabaseService } from '../neo4j/db.service';
import { ProfileService } from '../profile/profile.service';
import { InteractionRepository } from './interaction.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Interaction } from './interaction.entity';
import { GetSubscribersResponse } from './types';
import { User } from '../auth/user.entity';

@Injectable()
export class UserInteractionService {
  constructor(
    @InjectRepository(Interaction)
    private readonly interactionRepository: InteractionRepository,
    private readonly authService: AuthService,
    private readonly likeService: LikeService,
    private readonly profileService: ProfileService,
    private readonly databaseService: DatabaseService
  ) {}

  async getUserProfileStats(username: string): Promise<UserInformation> {
    const user = await this.authService.getUser(username);
    if (user === null) {
      return {
        imageBase64: '',
        exists: false,
        username: username,
        likes: [],
        added: [],
        relationshipsCount: 0,
        nodesCount: 0,
        subscribers: '[]',
        subscriptions: '[]',
      };
    }

    const stats = await this.profileService.getProfileStats(username);

    const response: UserInformation = {
      imageBase64: user.pictureBase64,
      exists: true,
      username: user.username,
      likes: await this.databaseService.getNodesShort(
        (await this.likeService.findUserLikes(user)).map((like) => like.nodeId)
      ),
      added: await this.databaseService.getUserAddedNodes(username),
      relationshipsCount: stats.relsCount,
      nodesCount: stats.nodesCount,
      subscribers: user.subscribers,
      subscriptions: user.subscriptions,
    };

    return response;
  }

  async getUserPendingNotifications(username: string) {
    return await this.interactionRepository.find({
      where: { receiverUsername: username, viewed: false },
    });
  }

  async viewNotification(id: string) {
    const notifications = await this.interactionRepository.find({
      where: { id: id, viewed: false },
    });

    const notification = notifications.at(0);
    return notification
      ? await this.interactionRepository.update(
          { id: id },
          { ...notification, viewed: true }
        )
      : null;
  }

  async getUserSubscribers(
    username: string
  ): Promise<GetSubscribersResponse[]> {
    const subscribers = JSON.parse(
      (await this.authService.getUser(username)).subscribers
    ) as string[];

    return subscribers.map((value) => {
      return {
        username: value,
        followsBack: false,
      };
    });
  }

  async getUserSubscriptions(username: string) {
    const subscriptions = JSON.parse(
      (await this.authService.getUser(username)).subscriptions
    ) as string[];

    return subscriptions;
  }

  async subscribeToTargetUser(targetUsername: string, actor: User) {
    const subscriptionsActor = JSON.parse(actor.subscriptions) as string[];
    const targetUser = await this.authService.getUser(targetUsername);
    const subscribersTarget = JSON.parse(targetUser.subscribers) as string[];

    if (subscriptionsActor.includes(targetUsername)) {
      throw new ConflictException(
        `User ${actor.username} already subscribed to ${targetUsername}.`
      );
    }

    await this.interactionRepository.createInteraction({
      actorUsername: actor.username,
      receiverUsername: targetUsername,
      state: 'subscribed',
      viewed: false,
    });

    subscriptionsActor.push(targetUsername);
    subscribersTarget.push(actor.username);

    targetUser.subscribers = JSON.stringify([...subscribersTarget]);
    actor.subscriptions = JSON.stringify([...subscriptionsActor]);

    await Promise.allSettled([
      this.authService.updateUser(targetUser.username, targetUser),
      this.authService.updateUser(actor.username, actor),
    ]);
  }

  async unsubscribeFromTargetUser(targetUsername: string, actor: User) {
    let subscriptionsActor = JSON.parse(actor.subscriptions) as string[];
    const targetUser = await this.authService.getUser(targetUsername);
    let subscribersTarget = JSON.parse(targetUser.subscribers) as string[];

    if (!subscriptionsActor.includes(targetUsername)) {
      throw new ConflictException(
        `User ${actor.username} is not subscribed to ${targetUsername}`
      );
    }

    await this.interactionRepository.createInteraction({
      actorUsername: actor.username,
      receiverUsername: targetUsername,
      state: 'unsubscribed',
      viewed: false,
    });

    subscriptionsActor = subscriptionsActor.filter(
      (username) => username !== targetUsername
    );
    subscribersTarget = subscribersTarget.filter(
      (username) => username !== actor.username
    );

    targetUser.subscribers = JSON.stringify([...subscribersTarget]);
    actor.subscriptions = JSON.stringify([...subscriptionsActor]);

    await Promise.allSettled([
      this.authService.updateUser(targetUser.username, targetUser),
      this.authService.updateUser(actor.username, actor),
    ]);
  }
}
