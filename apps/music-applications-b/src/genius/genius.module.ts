import { Module } from '@nestjs/common';
import { GeniusService } from './genius.service';
import { GeniusController } from './genius.controller';

@Module({
  providers: [GeniusService],
  controllers: [GeniusController]
})
export class GeniusModule {}
