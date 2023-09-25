import { Injectable } from '@nestjs/common';
import { ApplicationConfig } from '../../../config/config';
import Genius = require('genius-lyrics');

@Injectable()
export class GeniusService {
  private readonly geniusClient!: Genius.Client;
  constructor() {
    this.geniusClient = new Genius.Client(
      ApplicationConfig.genius_api_key
    );
  }

  public async getLyricsByQuery(query: string) {
    const searchResults = await this.geniusClient.songs.search(query);

    if (searchResults.length === 0) {
      return 'Lyrics was not found';
    } else {
      // it is possible to remove chorus
      const lyrics = await searchResults.at(0).lyrics(true);
      return lyrics;
    }
  }
}
