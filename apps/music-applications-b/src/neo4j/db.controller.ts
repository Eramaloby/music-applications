import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { DatabaseService } from './db.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { ProfileService } from '../profile/profile.service';
import { TaskService } from '../task/task.service';
import { AlbumModel, ArtistModel, GenreModel, PlaylistModel, TrackModel } from './types';

@Controller('neo4j')
@UseGuards(AuthGuard())
export class DatabaseController {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly profileService: ProfileService,
    private readonly taskService: TaskService
  ) {}

  @Delete(':id')
  async deleteItemFromDatabase(@Param() param) {
    console.log(param);
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
  async addUserItem(@Param() params, @Body() dto: TrackModel | AlbumModel | PlaylistModel | GenreModel | ArtistModel, @GetUser() user: User) {
    const result = await this.dbService.performAddTransactionCustom(params.type, dto, user.username);

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
}
