import { ChangePasswordFlowController } from '../auth/controllers/change-password.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {
  TypeOrmModule,
  getRepositoryToken,
  getDataSourceToken,
} from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity';

import { ApplicationConfig } from '../../../config/config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { customUserRepository } from './user.repository';
import { UserController } from './controllers/user.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: ApplicationConfig.jwt_secret,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  providers: [
    {
      provide: getRepositoryToken(User),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource.getRepository(User).extend(customUserRepository);
      },
    },
    AuthService,
    JwtStrategy,
  ],
  controllers: [AuthController, ChangePasswordFlowController, UserController],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
