import { Module } from '@nestjs/common';
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from '@nestjs/typeorm';
import { Task } from './task.entity';
import { customTaskRepository } from './task.repository';
import { TaskService } from './task.service';
import { DataSource } from 'typeorm';
import { AuthModule } from '../auth/auth.module';
import { TaskController } from './task.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
  providers: [
    {
      provide: getRepositoryToken(Task),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource.getRepository(Task).extend(customTaskRepository);
      },
    },
    TaskService,
  ],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
