import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DatabaseService } from './db.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import {
  PostAlbumDto,
  PostArtistDto,
  PostGenreDto,
  PostPlaylistDto,
  PostTrackDto,
} from './dto';
import { ProfileService } from '../profile/profile.service';
import { TaskService } from '../task/task.service';

@Controller('neo4j')
@UseGuards(AuthGuard())
export class DatabaseController {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly profileService: ProfileService,
    private readonly taskService: TaskService
  ) {}

  @Post(':type/:id')
  async addItemFromSpotify(@Param() params, @GetUser() user: User) {
    // fix error with relationships count
    // TODO REFACTOR: pass user as parameter ?
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

  @Post('/track')
  async addUserTrack(dto: PostTrackDto, @GetUser() user: User) {
    console.log(dto);
  }

  @Post('/album')
  async addUserAlbum(dto: PostAlbumDto, @GetUser() user: User) {
    console.log(dto);
  }

  @Post('/artist')
  async addUserArtist(dto: PostArtistDto, @GetUser() user: User) {
    console.log(dto);
  }

  @Post('/playlist')
  async addUserPlaylist(dto: PostPlaylistDto, @GetUser() user: User) {
    console.log(dto);
  }

  @Post('/genre')
  async addUserGenre(@Body() dto: PostGenreDto, @GetUser() user: User) {
    console.log('post request passed dto', dto);
  }
}
