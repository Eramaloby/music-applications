import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { CreateTaskDto } from './task.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: TaskRepository
  ) {}

  async createTask(user: User, dto: CreateTaskDto) {
    await this.taskRepository.createTask(user, dto);
  }

  async getAllUserTasks(user: User) {
    return await this.taskRepository.find({ where: { user } });
  }
}
