import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserCredentialsSignUpDto } from './dto/sign-up-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository
  ) {}

  async signUp(authUserCredentialDto: UserCredentialsSignUpDto) {
    return this.userRepository.createUser(authUserCredentialDto);
  }
}
