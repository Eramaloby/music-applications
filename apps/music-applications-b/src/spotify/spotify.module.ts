import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyController } from './spotify.controller';
import { SpotifyTokenController } from './spotify-token.controller';

@Module({
  imports: [],
  controllers: [SpotifyController, SpotifyTokenController],
  providers: [SpotifyService],
  exports: [SpotifyService],
})
export class SpotifyModule {}
