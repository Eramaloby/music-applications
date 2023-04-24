import { Controller, Get, UseGuards, Body, Post, Query } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ConfirmPasswordDto } from '../dto/confirm-password.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { User } from '../entities/user.entity';
import { GetUser } from '../decorators/get-user.decorator';

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
