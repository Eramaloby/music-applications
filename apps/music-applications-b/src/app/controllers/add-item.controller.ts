import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { DatabaseManager } from '../services/db-manager.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('add')
@UseGuards(AuthGuard())
export class AddItemController {
  constructor(private readonly dbManager: DatabaseManager) {}

  @Post(':type/:id')
  async addTrack(@Param() params, @GetUser() user: User) {
    switch (params.type) {
      case 'track':
        return await this.dbManager.addTrack(params.id, user.username);
      case 'album':
        return await this.dbManager.addAlbum(params.id, user.username);
      case 'artist':
        return await this.dbManager.addArtist(params.id, user.username);
      case 'playlist':
        return await this.dbManager.addPlaylist(params.id, user.username);
    }
  }
}
