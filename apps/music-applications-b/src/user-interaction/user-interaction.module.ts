import { Module } from '@nestjs/common';
import { UserInteractionsController } from './user-interaction.controller';
import { UserInteractionService } from './user-interaction.service';
import { AuthModule } from '../auth/auth.module';
import { LikesModule } from '../likes/likes.module';
import { Neo4jDatabaseModule } from '../neo4j/db.module';

@Module({
  imports: [AuthModule, LikesModule, Neo4jDatabaseModule],
  providers: [UserInteractionService],
  controllers: [UserInteractionsController],
})
export class UserInteractionModule {}
