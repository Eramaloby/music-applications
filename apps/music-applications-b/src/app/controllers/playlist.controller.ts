import { Controller, Get, Param, Post } from '@nestjs/common';
import { DatabaseManager } from '../services/db-manager.service';
import { SpotifyService } from '../services/spotify.service';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly dbManager: DatabaseManager
  ) {}

  @Get('/:id')
  async get(@Param() params) {
    const res = await this.spotifyService.getPlaylistById(params.id);
    return res;
  }

  @Post('/:id')
  async post(@Param() params) {
    const res = await this.dbManager.addPlaylist(params.id);
    return res;
  }
}
