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
        imageBase64: '',
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
      imageBase64: user.pictureBase64,
      exists: true,
      username: user.username,
      likes: await this.databaseService.getNodesShort(
        (await this.likeService.findUserLikes(user)).map((like) => like.nodeId)
      ),
      added: await this.databaseService.getUserAddedNodes(username),
      relationshipsCount: stats.relsCount,
      nodesCount: stats.nodesCount,
    };

    return response;
  }
}
