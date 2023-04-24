import { Module } from '@nestjs/common';
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DataSource } from 'typeorm';
import { Like } from './like.entity';
import { customLikeRepository } from './like.repository';
import { LikeService } from './like.service';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), AuthModule],
  providers: [
    {
      provide: getRepositoryToken(Like),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource.getRepository(Like).extend(customLikeRepository);
      },
    },
    LikeService,
  ],
  controllers: [],
  exports: [LikeService],
})
export class LikesModule {}
