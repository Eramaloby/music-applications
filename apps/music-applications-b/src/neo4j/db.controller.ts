import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DatabaseService } from './db.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('neo4j')
@UseGuards(AuthGuard())
export class DatabaseController {
  constructor(private readonly dbService: DatabaseService) {}

  @Post(':type/:id')
  async addTrack(@Param() params, @GetUser() user: User) {
    switch (params.type) {
      case 'track':
        return await this.dbService.addTrack(params.id, user.username);
      case 'album':
        return await this.dbService.addAlbum(params.id, user.username);
      case 'artist':
        return await this.dbService.addArtist(params.id, user.username);
      case 'playlist':
        return await this.dbService.addPlaylist(params.id, user.username);
    }
  }

  @Get('stats')
  async getUserStats(@GetUser() user: User) {
    return await this.dbService.getUserDbStats(user.username);
  }
}
