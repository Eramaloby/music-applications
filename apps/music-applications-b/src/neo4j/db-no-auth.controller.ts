import { Controller, Get, Param, Query } from '@nestjs/common';
import { DatabaseService } from './db.service';

@Controller('neo4j')
export class DatabaseNoAuthController {
  constructor(private readonly dbService: DatabaseService) {}

  @Get(':type/:id')
  async getDatabaseItem(@Param() params) {
    // lowercase params later
    switch (params.type) {
      case 'genre':
        return await this.dbService.getGenreFull(params.id);
      case 'artist':
        return await this.dbService.getArtistFull(params.id);
      case 'track':
        return await this.dbService.getTrackFull(params.id);
      case 'album':
        return await this.dbService.getAlbumFull(params.id);
      case 'playlist':
        return await this.dbService.getPlaylistFull(params.id);
      default:
        return null;
    }
  }

  @Get('items/all/:type')
  async getDatabaseItemByType(@Param() params) {
    const type = params.type.at(0).toLocaleUpperCase() + params.type.slice(1);
    return await this.dbService.getNodesWithType(type);
  }

  @Get('search')
  async getData(@Query() query: { [searchType: string]: string }) {
    return await this.dbService.getData(query);
  }

  @Get('/stats')
  async getDatabaseStats() {
    const res = await this.dbService.getDbStats();
    return res;
  }

  @Get(':id')
  async isThereInstanceWithId(@Param() params) {
    return await this.dbService.instanceWithIdExists(params.id);
  }
}
