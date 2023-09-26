import { Controller, Get, Request, Response } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('')
export class SpotifyTokenController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('callback')
  async callback(@Request() request, @Response() response) {
    const error = request.query.error;
    const code = request.query.code;
    // const state = request.query.state;

    if (error) {
      console.log('Callback error: ', error);
      return error;
    }

    this.spotifyService.SpotifyWebApi.authorizationCodeGrant(code)
      .then((data) => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];

        // set up guard to monitor expiring token

        this.spotifyService.SpotifyWebApi.setAccessToken(access_token);
        this.spotifyService.SpotifyWebApi.setRefreshToken(refresh_token);

        response.send('Success, close this window now');

        setInterval(async () => {
          const data =
            await this.spotifyService.SpotifyWebApi.refreshAccessToken();
          const access_token = data.body['access_token'];
          this.spotifyService.SpotifyWebApi.setAccessToken(access_token);

          console.log('token was refreshed!');
        }, (expires_in / 2) * 1000);
      })
      .catch((error) => {
        console.log('Error getting tokens', error);
        response.send(`Error getting tokens: ${error}`);
      });
  }
}
