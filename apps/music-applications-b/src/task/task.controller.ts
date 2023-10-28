import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TaskService } from './task.service';

@UseGuards(AuthGuard())
@Controller('task')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  // @Get('all')
  // public async getAllUserTasks(@GetUser() user: User) {
  //   return await this.getAllUserTasks(user);
  // }
}
