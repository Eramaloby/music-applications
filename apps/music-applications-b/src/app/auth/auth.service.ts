import { ConfirmPasswordDto } from './dto/confirm-password.dto';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserCredentialsSignUpDto } from './dto/sign-up-credentials.dto';
import { UserCredentialsSignInDto } from './dto/sign-in-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt/jwt.payload';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async signUp(authUserCredentialDto: UserCredentialsSignUpDto) {
    return this.userRepository.createUser(authUserCredentialDto);
  }

  async signIn(
    authUserSignInCredentialsDto: UserCredentialsSignInDto
  ): Promise<{ accessToken: string }> {
    const { username, password } = authUserSignInCredentialsDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = {
        username: user.username,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
      };

      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your credentials');
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto, username: string) {
    const { password, newPassword } = changePasswordDto;
    const user = await this.userRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      return await this.userRepository.update(
        { username: username },
        {
          password: hashedPassword,
        }
      );
    } else {
      throw new InternalServerErrorException();
    }
  }

  async comparePasswords(
    confirmPasswordDto: ConfirmPasswordDto,
    username: string
  ) {
    const { password } = confirmPasswordDto;
    const user = await this.userRepository.findOne({ where: { username } });

    // decompose to one line
    if (user && (await bcrypt.compare(password, user.password))) {
      return true;
    } else {
      return false;
    }
  }
}
