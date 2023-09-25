import { Controller, Get, UseGuards, Body, Post, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ConfirmPasswordDto } from '../dto/confirm-password.dto';
import { GetUser } from '../get-user.decorator';
import { User } from '../user.entity';

@Controller('password')
@UseGuards(AuthGuard())
export class ChangePasswordFlowController {
  constructor(private readonly authService: AuthService) {}

  @Get('compare')
  async isCurrentPassword(@Query() confirmPasswordDto, @GetUser() user: User) {
    return this.authService.comparePasswords(
      confirmPasswordDto as ConfirmPasswordDto,
      user.username
    );
  }

  @Post('update')
  async updatePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: User
  ) {
    return this.authService.changePassword(changePasswordDto, user.username);
  }
}
