import { Injectable, NotFoundException } from '@nestjs/common';
import { LikeRepository } from './like.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private readonly likeRepository: LikeRepository
  ) {}

  async createLike(user: User, nodeId: number) {
    return await this.likeRepository.createLike(user, nodeId);
  }

  async deleteLike(user: User, nodeId: number) {
    const result = await this.likeRepository.delete({ user, nodeId });

    if (result.affected === 0) {
      throw new NotFoundException(`No like with credentials found.`);
    }
  }
}
