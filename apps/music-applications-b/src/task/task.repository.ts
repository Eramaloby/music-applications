import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './task.dto';
import { User } from '../auth/user.entity';

export interface TaskRepository extends Repository<Task> {
  this: Repository<Task>;
  createTask(user: User, dto: CreateTaskDto): Promise<void>;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customTaskRepository: Pick<TaskRepository, any> = {
  async createTask(
    this: Repository<Task>,
    user: User,
    dto: CreateTaskDto
  ): Promise<void> {
    const task = this.create({
      user: user,
      successful: dto.successful,
      details: dto.details,
      relationshipCount: dto.relationshipCount,
      reason: dto.reason,
    });

    try {
      await this.save(task);
    } catch (error) {
      console.log(error);
    }
  },
};
