import { Controller, Get, Param, Post } from '@nestjs/common';
import { DatabaseManager } from '../services/db-manager.service';
import { SpotifyService } from '../services/spotify.service';

@Controller('track')
export class TrackController {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly dbManager: DatabaseManager
  ) {}

  @Get('/:id')
  async get(@Param() params) {
    const result = await this.spotifyService.getTrackById(params.id);
    return result;
  }

  @Post('/:id')
  async post(@Param() params) {
    const res = await this.dbManager.addTrack(params.id);
    return res;
  }
}
