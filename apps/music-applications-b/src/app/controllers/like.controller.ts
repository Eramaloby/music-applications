import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { DatabaseManager } from '../services/db-manager.service';
import { LikeService } from '../likes/like.service';
import { CreateDeleteLikeSpotifyDto } from '../dto/create-delete-like-spotify.dto';
import { CreateDeleteLikeDto } from '../dto/create-delete-like.dto';

@UseGuards(AuthGuard())
@Controller('like')
export class LikeController {
  constructor(
    private readonly likeService: LikeService,
    private readonly dbManager: DatabaseManager
  ) {}

  @Post()
  async createLike(
    @Body() createLikeDto: CreateDeleteLikeSpotifyDto,
    @GetUser() user
  ) {
    const [item] = await this.dbManager.findNodeBySpotifyId(
      createLikeDto.spotify_id
    );

    const nodeId: number = item.get('instance')['properties']['id'];
    return this.likeService.createLike(user, nodeId);
  }

  @Delete()
  async deleteLike(
    @Body() createLikeDto: CreateDeleteLikeSpotifyDto,
    @GetUser() user
  ) {
    const [item] = await this.dbManager.findNodeBySpotifyId(
      createLikeDto.spotify_id
    );

    const nodeId: number = item.get('instance')['properties']['id'];
    console.log(nodeId);
    return this.likeService.deleteLike(user, nodeId);
  }

  @Post('/db')
  async createLikeFromDb(
    @Body() createDeleteLikeDb: CreateDeleteLikeDto,
    @GetUser() user
  ) {
    return this.likeService.deleteLike(user, createDeleteLikeDb.nodeId);
  }

  @Delete('/db')
  async deleteLikeFromDb(
    @Body() createDeleteLikeDb: CreateDeleteLikeDto,
    @GetUser() user
  ) {
    return this.likeService.deleteLike(user, createDeleteLikeDb.nodeId);
  }
}
