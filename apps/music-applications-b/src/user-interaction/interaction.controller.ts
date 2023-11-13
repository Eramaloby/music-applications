import { Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserInteractionService } from './user-interaction.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('interaction')
@UseGuards(AuthGuard())
export class UserInteractionsAuthController {
  constructor(private readonly service: UserInteractionService) {}

  @Post('/:username')
  public async subscribeToUser(
    @Param() params: { username: string },
    @GetUser() actorUser: User
  ) {
    await this.service.subscribeToTargetUser(params.username, actorUser);
  }

  @Patch('/:username')
  public async unsubscribeFromUser(
    @Param() params: { username: string },
    @GetUser() actorUser: User
  ) {
    await this.service.unsubscribeFromTargetUser(params.username, actorUser);
  }
}
