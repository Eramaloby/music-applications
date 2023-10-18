import { Controller, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('test')
export class ProfileNoAuthController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('fix-stats')
  async clearStats() {
    return await this.profileService.clearStats();
  }
}
