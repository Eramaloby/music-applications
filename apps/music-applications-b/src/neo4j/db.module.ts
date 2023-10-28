import { Module } from '@nestjs/common';
import { ApplicationConfig } from '../../../config/config';
import { Neo4jModule, Neo4jScheme } from 'nest-neo4j/dist';
import { DatabaseService } from './db.service';
import { AuthModule } from '../auth/auth.module';
import { SpotifyModule } from '../spotify/spotify.module';
import { DatabaseController } from './db.controller';
import { DatabaseNoAuthController } from './db-no-auth.controller';
import { ProfileModule } from '../profile/profile.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [
    Neo4jModule.forRoot({
      scheme: ApplicationConfig.scheme_neo4j as Neo4jScheme,
      host: ApplicationConfig.host_neo4j,
      port: '',
      username: ApplicationConfig.username_neo4j,
      password: ApplicationConfig.password_neo4j,
    }),
    AuthModule,
    SpotifyModule,
    ProfileModule,
    TaskModule,
  ],
  controllers: [DatabaseController, DatabaseNoAuthController],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class Neo4jDatabaseModule {}
