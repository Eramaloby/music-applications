import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { DatabaseManager } from '../services/db-manager.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('add')
@UseGuards(AuthGuard())
export class AddItemController {
  constructor(private readonly dbManager: DatabaseManager) {}

  @Post(':type/:id')
  async addTrack(@Param() params) {
    switch (params.type) {
      case 'track':
        return await this.dbManager.addTrack(params.id);
      case 'album':
        return await this.dbManager.addAlbum(params.id);
      case 'artist':
        return await this.dbManager.addArtist(params.id);
      case 'playlist':
        return await this.dbManager.addPlaylist(params.id);
    }
  }
}
