import { ChangePasswordFlowController } from './controllers/change-password.controller';
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
import { AuthController } from './controllers/auth.controller';
import { User } from './user.entity';

import { customUserRepository } from './user.repository';
import { ApplicationConfig } from '../../../../config/config';
import { JwtStrategy } from './jwt/jwt.strategy';
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
  controllers: [AuthController, ChangePasswordFlowController],
  exports: [PassportModule],
})
export class AuthModule {}
