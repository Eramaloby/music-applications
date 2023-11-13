import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { UserCredentialsSignUpDto } from './dto/sign-up-credentials.dto';

import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApplicationConfig } from '../../../config/config';

export interface UserRepository extends Repository<User> {
  this: Repository<User>;
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User>;
  createUser(userCredentialsSignUpDto: UserCredentialsSignUpDto): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customUserRepository: Pick<UserRepository, any> = {
  getUser(this: Repository<User>, id: string) {
    return this.findOne({ where: { id } });
  },
  getUsers(this: Repository<User>) {
    return this.find();
  },
  async createUser(
    this: Repository<User>,
    userCredentialsSignUpDto: UserCredentialsSignUpDto
  ): Promise<void> {
    const { password } = userCredentialsSignUpDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      ...userCredentialsSignUpDto,
      password: hashedPassword,
      pictureBase64: ApplicationConfig.defaultProfilePictureBase64,
      likes: [],
      tasks: [],
      relationshipsAddedCount: 0,
      nodesAddedCount: 0,
      subscribers: '',
      subscriptions: '',
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError && error['code'] === '23505') {
        const message = error['detail'].replace(
          /^Key \((.*)\)=\((.*)\) (.*)/,
          '$1 $2 already exists.'
        );
        throw new ConflictException(message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  },
};
