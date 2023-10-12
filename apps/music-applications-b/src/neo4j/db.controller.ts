import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DatabaseService } from './db.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('neo4j')
@UseGuards(AuthGuard())
export class DatabaseController {
  constructor(private readonly dbService: DatabaseService) {}

  @Post(':type/:id')
  async addItem(@Param() params, @GetUser() user: User) {
    return await this.dbService.performAddTransaction(
      params.type,
      params.id,
      user.username
    );
  }

  @Get('stats')
  async getUserStats(@GetUser() user: User) {
    return await this.dbService.getUserDbStats(user.username);
  }
}
