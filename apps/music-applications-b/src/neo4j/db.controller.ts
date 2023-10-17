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

@Controller('neo4j')
@UseGuards(AuthGuard())
export class DatabaseController {
  constructor(private readonly dbService: DatabaseService) {}

  @Post(':type/:id')
  async addItem(@Param() params, @GetUser() user: User) {
    // return await this.dbService.performAddTransaction(
    //   params.type,
    //   params.id,
    //   user.username
    // );
    return null;
  }

  @Get('stats')
  async getUserStats(@GetUser() user: User) {
    return await this.dbService.getUserDbStats(user.username);
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
