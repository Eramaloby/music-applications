import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entites/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { JwtPayload } from './jwt.payload';
import { ApplicationConfig } from '../../../../../config/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository
  ) {
    super({
      secretOrKey: ApplicationConfig.jwt_secret,
      jwtFromRequest: ExtractJwt,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;

    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
