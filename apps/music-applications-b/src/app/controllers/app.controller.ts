import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { GeniusService } from '../../genius/genius.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/user.entity';
import { GetUser } from '../../auth/get-user.decorator';

@Controller()
export class AppController {
  // refactor controllers to different files later
  // move to future profile module?
  @UseGuards(AuthGuard())
  @Get('currentUser')
  async getCurrentUser(@GetUser() user: User) {
    console.log('CURRENT USER', user);
    return user;
  }
}
