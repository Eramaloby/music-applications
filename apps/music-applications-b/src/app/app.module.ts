import { ApplicationConfig } from './../../../config/config';
import { Module } from '@nestjs/common';

import { AppController } from './controllers/app.controller';
import { GeniusService } from '../genius/genius.service';

import { TypeOrmModule } from '@nestjs/typeorm';

import { NetworkController } from './controllers/network.controller';
import { AuthModule } from '../auth/auth.module';
import { LikesModule } from '../likes/likes.module';
import { Neo4jDatabaseModule } from '../neo4j/db.module';
import { SpotifyModule } from '../spotify/spotify.module';
import { GeniusModule } from '../genius/genius.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: ApplicationConfig.url_postgres,
      port: ApplicationConfig.port_postgres,
      username: ApplicationConfig.username_postgres,
      database: ApplicationConfig.database_postgres,
      autoLoadEntities: true,
      synchronize: true,
    }),

    AuthModule,
    LikesModule,
    Neo4jDatabaseModule,
    SpotifyModule,
    GeniusModule,
  ],
  controllers: [AppController, NetworkController],
  providers: [GeniusService],
})
export class AppModule {}
