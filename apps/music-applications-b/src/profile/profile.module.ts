import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { ProfileController } from './profile.controller';
import { AuthModule } from '../auth/auth.module';
import { ProfileNoAuthController } from './profile-no-auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  providers: [ProfileService],
  controllers: [ProfileController, ProfileNoAuthController],
  exports: [ProfileService],
})
export class ProfileModule {}
