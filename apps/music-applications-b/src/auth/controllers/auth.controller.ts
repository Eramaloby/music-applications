import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserCredentialsSignInDto } from '../dto/sign-in-credentials.dto';
import { UserCredentialsSignUpDto } from '../dto/sign-up-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() userCredentialsSignUpDto: UserCredentialsSignUpDto) {
    return this.authService.signUp(userCredentialsSignUpDto);
  }

  @Post('/signin')
  async signIn(@Body() userCredentialsSignInDto: UserCredentialsSignInDto) {
    return this.authService.signIn(userCredentialsSignInDto);
  }
}
