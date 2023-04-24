import { ApplicationConfig } from './../../../config/config';
import { Module } from '@nestjs/common';

import { AppController } from './controllers/app.controller';
import { GeniusService } from './services/genius.service';

import { Neo4jModule, Neo4jScheme } from 'nest-neo4j/dist';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NetworkController } from './controllers/network.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseManager } from './services/db-manager.service';
import { SpotifyService } from './services/spotify.service';
import { AddItemController } from './controllers/add-item.controller';
import { GetItemController } from './controllers/get-item.controller';
import { LikesModule } from './likes/likes.module';
import { LikeController } from './controllers/like.controller';
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
    Neo4jModule.forRoot({
      scheme: ApplicationConfig.scheme_neo4j as Neo4jScheme,
      host: ApplicationConfig.host_neo4j,
      port: '',
      username: ApplicationConfig.username_neo4j,
      password: ApplicationConfig.password_neo4j,
    }),
    AuthModule,
    LikesModule,
  ],
  controllers: [
    AppController,
    NetworkController,
    AddItemController,
    GetItemController,
    LikeController,
  ],
  providers: [GeniusService, DatabaseManager, SpotifyService],
})
export class AppModule {}
