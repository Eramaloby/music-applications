import { Controller, Get, Param, Query } from '@nestjs/common';
import { DatabaseService } from './db.service';

@Controller('neo4j')
export class DatabaseNoAuthController {
  constructor(private readonly dbService: DatabaseService) {}

  @Get(':type/:id')
  async getDatabaseItem(@Param() params) {
    const result = await this.dbService.findNodeAndRelationsWithId(
      params.id,
      params.type
    );

    const nodeWithRelationships = result.map((value) => value['_fields']);
    const nodeWithOwnProperties = nodeWithRelationships[0][0];
    const relationshipsWithConnectedNode = nodeWithRelationships.map(
      (entity) => {
        return { relType: entity[1].type, obj: entity[2] };
      }
    );

    console.log(nodeWithOwnProperties);
    console.log(relationshipsWithConnectedNode);
    console.log(
      relationshipsWithConnectedNode.forEach((entity) => {
        console.log(entity.relType);
        console.log(entity.obj.properties);
      })
    );

    return result;
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
    return await this.dbService.instanceWithIdExists(params.id);
  }

  @Get('/test/album/:id')
  async getAlbumTest(@Param() params) {
    return await this.dbService.getAlbumWithRelations(params.id);
  }
}
