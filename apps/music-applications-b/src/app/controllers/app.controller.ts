import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { DatabaseManager } from '../services/db-manager.service';
import { GeniusService } from '../services/genius.service';
import { SpotifyService } from '../services/spotify.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly dbManager: DatabaseManager,
    private readonly geniusService: GeniusService
  ) {}

  // refactor controllers to different files later
  @Get('search')
  async getData(@Query() query) {
    const res = await this.dbManager.getData(query);
    return res;
  }

  @UseGuards(AuthGuard())
  @Get('currentUser')
  async getCurrentUser(@GetUser() user: User) {
    return user;
  }

  @Get('node-relation/:type/:name')
  async getNodeAndRelations(@Param() params) {
    const res = await this.dbManager.findNodeAndRelationsByName(
      params.type,
      params.name
    );

    return res;
  }

  @Get('lyrics')
  async getLyrics(@Request() request) {
    // seems strange, but that's how passing params to axios get works
    const searchQuery = request.query.query;

    const result = await this.geniusService.getLyricsByQuery(searchQuery);
    // console.log(searches[0].lyrics());

    return result;
  }

  @Get('db-stats')
  async getDatabaseStats() {
    const res = await this.dbManager.getCountOfNodesInDb();
    const values = res.records[0]['_fields'].map(
      (obj: { low: number }) => obj.low
    );
    return values;
  }

  @Get('web-search')
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
