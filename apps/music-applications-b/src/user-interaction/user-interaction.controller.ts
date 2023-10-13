import { Controller, Get, Param } from '@nestjs/common';
import { UserInteractionService } from './user-interaction.service';

@Controller('interactions')
export class UserInteractionsController {
  constructor(
    private readonly userInteractionService: UserInteractionService
  ) {}
  @Get('user/:username')
  async getUser(@Param() dto: { username: string }) {
    console.log('GIVEN DTO', dto.username);
    return await this.userInteractionService.getUserProfileStats(dto.username);
  }
}
