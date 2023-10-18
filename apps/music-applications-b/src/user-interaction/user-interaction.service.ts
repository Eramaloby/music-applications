import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserInformation } from './user.data';
import { LikeService } from '../likes/like.service';
import { DatabaseService } from '../neo4j/db.service';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class UserInteractionService {
  constructor(
    private readonly authService: AuthService,
    private readonly likeService: LikeService,
    private readonly profileService: ProfileService,
    private readonly databaseService: DatabaseService
  ) {}

  async getUserProfileStats(username: string): Promise<UserInformation> {
    const user = await this.authService.getUser(username);
    if (user === null) {
      return {
        exists: false,
        username: username,
        likes: [],
        added: [],
        relationshipsCount: 0,
        nodesCount: 0,
      };
    }

    const stats = await this.profileService.getProfileStats(username);

    const response: UserInformation = {
      exists: true,
      username: user.username,
      likes: await this.likeService.findUserLikes(user),
      added: await this.databaseService.getUserAddedNodes(username),
      relationshipsCount: stats.relsCount,
      nodesCount: stats.nodesCount,
    };

    return response;
  }
}
