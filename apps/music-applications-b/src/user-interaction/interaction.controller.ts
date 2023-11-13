import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserInteractionService } from './user-interaction.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('interaction')
@UseGuards(AuthGuard())
export class UserInteractionsAuthController {
  constructor(private readonly service: UserInteractionService) {}

  @Get('/:username')
  public async getUserPendingNotifications(
    @Param() params: { username: string }
  ) {
    return await this.service.getUserPendingNotifications(params.username);
  }

  // @Get('subscribed-to/:username')
  // public async getUserSubscriptions(@Param() params: {username: string}) {
  //   return await this.service.getUserSubscribers(params.username);
  // }

  // //
  // @Get('subscribed-by/:username')
  // public async getUserSubscribers(@Param() params: {username: string}) {
  //   return await this.service.getUserSubscriptions(params.username);
  // }

  @Post('/:username')
  public async subscribeToUser(
    @Param() params: { username: string },
    @GetUser() actorUser: User
  ) {
    await this.service.subscribeToTargetUser(params.username, actorUser);
  }
}
