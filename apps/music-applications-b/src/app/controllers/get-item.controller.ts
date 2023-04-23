import { Controller, Get, Param } from '@nestjs/common';
import { SpotifyService } from '../services/spotify.service';

@Controller('item')
export class GetItemController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get(':type/:id')
  async getItem(@Param() params) {
    switch (params.type) {
      case 'track':
        return await this.spotifyService.getTrackById(params.id);
      case 'album':
        return await this.spotifyService.getAlbumById(params.id);
      case 'artist':
        return await this.spotifyService.getArtistById(params.id);
      case 'playlist':
        return await this.spotifyService.getPlaylistById(params.id);
    }
  }
}
