import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TaskService } from './task.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@UseGuards(AuthGuard())
@Controller('task')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Get()
  public async getAllUserTasks(@GetUser() user: User) {
    return await this.service.getAllUserTasks(user);
  }
}
