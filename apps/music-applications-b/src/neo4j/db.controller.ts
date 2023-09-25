import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
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

  @Get(':type/:id')
  async getDatabaseItem(@Param() params) {
    return await this.dbService.findNodeAndRelationsWithId(
      params.id,
      params.type
    );
  }

  @Get('search')
  async getData(@Query() query) {
    const res = await this.dbService.getData(query);
    return res;
  }

  @Get('exists/:id')
  async isThereInstanceWithId(@Param() params) {
    return await this.dbService.isThereInstanceWithId(params.id);
  }

  @Get('db-stats')
  async getDatabaseStats() {
    const res = await this.dbService.getDbStats();
    return res;
  }

  @Get('stats')
  async getUserStats(@GetUser() user: User) {
    return await this.dbService.getUserDbStats(user.username);
  }
}
