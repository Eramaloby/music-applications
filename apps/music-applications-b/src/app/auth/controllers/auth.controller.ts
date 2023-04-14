import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserCredentialsSignUpDto } from '../dto/sign-up-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() userCredentialsSignUpDto: UserCredentialsSignUpDto) {
    return this.authService.signUp(userCredentialsSignUpDto);
  }

  @Post('/signin')
  async signIn() {
    console.log('signin endpoint');
  }
}
