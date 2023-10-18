import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('profile')
@UseGuards(AuthGuard())
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('picture')
  async changeProfilePicture(
    @Body() dto: { pictureBase64: string },
    @GetUser() user: User
  ) {
    return await this.profileService.changeProfilePicture(
      dto.pictureBase64,
      user.username
    );
  }

  @Get('stats')
  async getProfileStats(@GetUser() user: User) {
    const result = await this.profileService.getProfileStats(user.username);
    return {
      relationshipCount: result.relsCount,
      nodesCount: result.nodesCount,
    };
  }
}
