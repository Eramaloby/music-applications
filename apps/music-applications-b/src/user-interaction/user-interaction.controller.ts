import { Body, Controller, Get } from '@nestjs/common';
import { UserInteractionService } from './user-interaction.service';

@Controller('interactions')
export class UserInteractionsController {
  constructor(
    private readonly userInteractionService: UserInteractionService
  ) {}
  @Get('user')
  async getUser(@Body() dto: { username: string }) {
    return await this.userInteractionService.getUserProfileStats(dto.username);
  }
}
