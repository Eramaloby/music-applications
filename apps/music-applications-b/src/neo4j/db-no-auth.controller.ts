import { Controller, Get, Param, Query } from '@nestjs/common';
import { DatabaseService } from './db.service';

@Controller('neo4j')
export class DatabaseNoAuthController {
  constructor(private readonly dbService: DatabaseService) {}

  @Get(':type/:id')
  async getDatabaseItem(@Param() params) {
    return await this.dbService.findNodeAndRelationsWithId(
      params.id,
      params.type
    );
  }

  @Get('search')
  async getData(@Query() query) {
    const res = await this.dbService.getData(query);
    return res;
  }

  @Get('db-stats')
  async getDatabaseStats() {
    const res = await this.dbService.getDbStats();
    return res;
  }

  @Get(':id')
  async isThereInstanceWithId(@Param() params) {
    return await this.dbService.isThereInstanceWithId(params.id);
  }
}
