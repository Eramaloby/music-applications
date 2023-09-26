import {
  Controller,
  Get,
  Query,
  Response,
  Param,
} from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get(':type/:id')
  async getItem(@Param() params: { type: string; id: string }) {
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

  @Get('search')
  async getWebData(@Query() query) {
    const res = await this.spotifyService.getWebData(query);
    return res;
  }

  @Get('login')
  async loginToSpotify(@Response() response) {
    response.redirect(
      this.spotifyService.SpotifyWebApi.createAuthorizeURL(
        this.spotifyService.scopes,
        'some-state-of-my-choice'
      )
    );
  }
}