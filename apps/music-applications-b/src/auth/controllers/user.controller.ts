import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { GetUser } from '../get-user.decorator';
import { User } from '../user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private readonly service: AuthService) {}

  @Post('picture')
  async changeProfilePicture(
    @Body() dto: { pictureBase64: string },
    @GetUser() user: User
  ) {
    return await this.service.changeProfilePicture(
      dto.pictureBase64,
      user.username
    );
  }
}
