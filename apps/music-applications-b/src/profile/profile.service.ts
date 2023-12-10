import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { UserRepository } from '../auth/user.repository';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository
  ) {}

  async changeProfilePicture(pictureBase64: string, username: string) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (user) {
      return await this.userRepository.update(
        { username: username },
        { pictureBase64: pictureBase64 }
      );
    } else {
      throw new InternalServerErrorException();
    }
  }

  async updateProfileDatabaseStats(
    nodeCountInc: number,
    relationshipsCountInc: number,
    username: string
  ) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (user) {
      const nodesUpdated = user.nodesAddedCount + nodeCountInc;
      const relsUpdated = user.relationshipsAddedCount + relationshipsCountInc;

      return await this.userRepository.update(
        { username: username },
        {
          relationshipsAddedCount: relsUpdated,
          nodesAddedCount: nodesUpdated,
        }
      );
    } else {
      throw new InternalServerErrorException();
    }
  }

  async getProfileStats(
    username: string
  ): Promise<{ nodesCount: number; relsCount: number }> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (user) {
      console.log('fetching results');
      return {
        nodesCount: user.nodesAddedCount,
        relsCount: user.relationshipsAddedCount,
      };
    } else {
      throw new InternalServerErrorException();
    }
  }

  async clearStats() {
    return await this.userRepository.update(
      {},
      { nodesAddedCount: 0, relationshipsAddedCount: 0 }
    );
  }
}
