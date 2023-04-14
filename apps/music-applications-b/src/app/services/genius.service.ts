import { Injectable } from '@nestjs/common';
import Genius = require('genius-lyrics');

@Injectable()
export class GeniusService {
  private readonly geniusClient!: Genius.Client;
  constructor() {
    this.geniusClient = new Genius.Client(
      'x-6rvPcfhlITShI5g-PE3nhGZccIIF7SYWtlKmc_FMbsp_usZ-yzMyn_K2bWGohe'
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
