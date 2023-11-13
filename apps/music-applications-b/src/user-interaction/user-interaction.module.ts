import { Module } from '@nestjs/common';
import { UserInteractionsController } from './user-interaction.controller';
import { UserInteractionService } from './user-interaction.service';
import { AuthModule } from '../auth/auth.module';
import { LikesModule } from '../likes/likes.module';
import { ProfileModule } from '../profile/profile.module';
import { Neo4jDatabaseModule } from '../neo4j/db.module';
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from '@nestjs/typeorm';
import { Interaction } from './interaction.entity';
import { DataSource } from 'typeorm';
import { customInteractionRepository } from './interaction.repository';
import { UserInteractionsAuthController } from './interaction.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interaction]),
    AuthModule,
    LikesModule,
    ProfileModule,
    Neo4jDatabaseModule,
  ],
  providers: [
    {
      provide: getRepositoryToken(Interaction),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource
          .getRepository(Interaction)
          .extend(customInteractionRepository);
      },
    },
    UserInteractionService,
  ],
  controllers: [UserInteractionsController, UserInteractionsAuthController],
})
export class UserInteractionModule {}
