import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DatabaseManager } from '../services/db-manager.service';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../auth/user.entity';

@UseGuards(AuthGuard())
@Controller('profile')
export class ProfileController {
  constructor(private readonly dbManager: DatabaseManager) {}

  @Get('stats')
  async getUserStats(@GetUser() user: User) {
    return await this.dbManager.getUserDbStats(user.username);
  }
}
