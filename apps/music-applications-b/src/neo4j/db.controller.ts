import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DatabaseService } from './db.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { ProfileService } from '../profile/profile.service';
import { TaskService } from '../task/task.service';
import {
  AlbumModel,
  ArtistModel,
  GenreModel,
  PlaylistModel,
  TrackModel,
} from './types';
import { HttpService } from '@nestjs/axios';
import { error } from 'console';

@Controller('neo4j')
@UseGuards(AuthGuard())
export class DatabaseController {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly profileService: ProfileService,
    private readonly taskService: TaskService,
    private readonly httpService: HttpService
  ) {}

  @Delete(':id')
  async deleteItemFromDatabase(@Param() param, @GetUser() user: User) {
    const result = await this.dbService.deleteInstanceById(param.id);
    await this.profileService.updateProfileDatabaseStats(
      -1,
      -result,
      user.username
    );
    return true;
  }

  @Patch(':type/:id')
  async updateItemFromDatabase(
    @Param() param,
    @Body()
    dto: TrackModel | AlbumModel | PlaylistModel | GenreModel | ArtistModel
  ) {
    const result = await this.dbService.updateObject(dto, param.type, param.id);
    return result;
  }

  @Post(':type/:id')
  async addItemFromSpotify(@Param() params, @GetUser() user: User) {
    const result = await this.dbService.performAddTransaction(
      params.type,
      params.id,
      user.username
    );

    if (result.isSuccess) {
      await this.profileService.updateProfileDatabaseStats(
        result.data.records.length,
        result.data.relationshipCount,
        user.username
      );

      await this.taskService.createTask(user, {
        successful: true,
        reason: 'Success',
        details: JSON.stringify(result.data.records),
        relationshipCount: result.data.relationshipCount,
        targetRecordId: params.id,
        targetRecordType: params.type,
      });

      this.httpService
        .post(
          `https://kmeans-rec-system.onrender.com/entities/${params.id}?type=${params.type}`
        )
        .subscribe({
          next: (response) => {
            console.log('success', response.status, response.data);
          },
          error: (obj) => {
            console.log('error', obj);
          },
        });
    } else {
      await this.taskService.createTask(user, {
        successful: false,
        reason: result.reason,
        details: 'Transaction was interrupted.',
        relationshipCount: 0,
        targetRecordId: params.id,
        targetRecordType: params.type,
      });
    }

    return result;
  }

  @Post('custom/user/:type/')
  async addUserItem(
    @Param() params,
    @Body()
    dto: TrackModel | AlbumModel | PlaylistModel | GenreModel | ArtistModel,
    @GetUser() user: User
  ) {
    const result = await this.dbService.performAddTransactionCustom(
      params.type,
      dto,
      user.username
    );

    if (result.isSuccess) {
      await this.profileService.updateProfileDatabaseStats(
        result.data.records.length,
        result.data.relationshipCount,
        user.username
      );

      await this.taskService.createTask(user, {
        successful: true,
        reason: 'Success',
        details: JSON.stringify(result.data.records),
        relationshipCount: result.data.relationshipCount,
        targetRecordId: 'Custom item',
        targetRecordType: params.type,
      });
    } else {
      await this.taskService.createTask(user, {
        successful: false,
        reason: result.reason,
        details: 'Transaction was interrupted.',
        relationshipCount: 0,
        targetRecordId: 'Custom item',
        targetRecordType: params.type,
      });
    }

    return result;
  }
}
