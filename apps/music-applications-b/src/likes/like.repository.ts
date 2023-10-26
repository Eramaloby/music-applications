import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { User } from '../auth/user.entity';

export interface LikeRepository extends Repository<Like> {
  this: Repository<Like>;
  createLike(user: User, nodeId: string): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customLikeRepository: Pick<LikeRepository, any> = {
  async createLike(
    this: Repository<Like>,
    user: User,
    nodeId: string
  ): Promise<void> {
    const like = this.create({ user: user, nodeId: nodeId });
    try {
      await this.save(like);
    } catch (error) {
      console.log(error);
    }
  },
};
