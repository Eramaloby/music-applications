import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserInteractionService } from './user-interaction.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('interactions')
export class UserInteractionsController {
  constructor(
    private readonly userInteractionService: UserInteractionService
  ) {}
  @Get('user/:username')
  async getUser(@Param() dto: { username: string }) {
    return await this.userInteractionService.getUserProfileStats(dto.username);
  }

  @UseGuards(AuthGuard())
  @Get('/')
  public async getUserPendingNotifications(@GetUser() user: User) {
    return await this.userInteractionService.getUserPendingNotifications(
      user.username
    );
  }

  @UseGuards(AuthGuard())
  @Patch('/:id')
  public async markNotificationAsViewed(@Param() params: { id: string }) {
    return await this.userInteractionService.viewNotification(params.id);
  }
}
