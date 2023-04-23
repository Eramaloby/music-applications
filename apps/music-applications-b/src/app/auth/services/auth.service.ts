import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserCredentialsSignUpDto } from '../dto/sign-up-credentials.dto';
import { UserCredentialsSignInDto } from '../dto/sign-in-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../jwt/jwt.payload';
import { JwtService } from '@nestjs/jwt';

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
}
