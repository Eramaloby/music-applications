import { Controller, Get, Param, Query } from '@nestjs/common';
import { DatabaseService } from './db.service';

@Controller('neo4j')
export class DatabaseNoAuthController {
  constructor(private readonly dbService: DatabaseService) {}

  @Get(':type/:id')
  async getDatabaseItem(@Param() params) {
    // lowercase params later
    switch (params.type) {
      case 'Genre':
        return await this.dbService.getGenreFull(params.id);
      case 'Artist':
        return await this.dbService.getArtistFull(params.id);
      case 'Track':
        return await this.dbService.getTrackFull(params.id);
      case 'Album':
        return await this.dbService.getAlbumFull(params.id);
      case 'Playlist':
        return await this.dbService.getPlaylistFull(params.id);
      default:
        return null;
    }
  }

  @Get('search')
  async getData(@Query() query) {
    const res = await this.dbService.getData(query);
    return res;
  }

  @Get('db-stats')
  async getDatabaseStats() {
    const res = await this.dbService.getDbStats();
    return res;
  }

  @Get(':id')
  async isThereInstanceWithId(@Param() params) {
    return await this.dbService.instanceWithIdExists(params.id);
  }
}
