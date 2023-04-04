import { Module } from '@nestjs/common';

import { AppController } from './controllers/app.controller';
import { GeniusService } from './genius.service';

import { Neo4jModule, Neo4jScheme } from 'nest-neo4j/dist';
import { ApplicationConfig } from '../../../config/config';
import { TrackController } from './controllers/track.controller';
import { PlaylistController } from './controllers/playlist.controller';
import { AlbumController } from './controllers/album.controller';
import { ArtistController } from './controllers/artist.controller';
import { DatabaseManager } from './db-manager.service';
import { SpotifyService } from './spotify.service';
import { NetworkController } from './controllers/network.controller';
@Module({
  imports: [
    Neo4jModule.forRoot({
      scheme: ApplicationConfig.scheme_neo4j as Neo4jScheme,
      host: ApplicationConfig.host_neo4j,
      port: '',
      username: ApplicationConfig.username_neo4j,
      password: ApplicationConfig.host_neo4j,
    }),
  ],
  controllers: [
    AppController,
    TrackController,
    PlaylistController,
    AlbumController,
    ArtistController,
    NetworkController,
  ],
  providers: [GeniusService, DatabaseManager, SpotifyService],
})
export class AppModule {}
