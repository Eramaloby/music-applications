import { Controller, Get, Request } from '@nestjs/common';
import { GeniusService } from './genius.service';

@Controller()
export class GeniusController {
  constructor(private readonly geniusService: GeniusService) {}

  @Get('lyrics')
  async getLyrics(@Request() request) {
    // TODO BACKEND: refactor all request params to normal
    // seems strange, but that's how passing params to axios get works
    const searchQuery = request.query.query;

    const result = await this.geniusService.getLyricsByQuery(searchQuery);
    // console.log(searches[0].lyrics());

    return result;
  }
}
