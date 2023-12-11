import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { LikeService } from './like.service';
import { CreateDeleteLikeDto } from './create-delete-like.dto';
import { User } from '../auth/user.entity';
import { DatabaseService } from '../neo4j/db.service';
import { CreateDeleteLikeSpotifyDto } from './dto/create-delete-like-spotify.dto';
import { HttpService } from '@nestjs/axios';

@UseGuards(AuthGuard())
@Controller('like')
export class LikeController {
  constructor(
    private readonly likeService: LikeService,
    private readonly dbManager: DatabaseService,
    private readonly http: HttpService
  ) {}

  @Get()
  async isLikeExists(@Query() params, @GetUser() user: User) {
    const [item] = await this.dbManager.findNodeBySpotifyId(params.spotifyId);
    const nodeId: string = item.get('instance')['properties']['id'];
    return this.likeService.isLikeExists(user, nodeId);
  }

  @Get('db')
  async isLikeExistsDb(@Query() params, @GetUser() user: User) {
    return this.likeService.isLikeExists(user, params.nodeId);
  }

  @Post()
  async createLike(
    @Body() createLikeDto: CreateDeleteLikeSpotifyDto,
    @GetUser() user
  ) {
    const [item] = await this.dbManager.findNodeBySpotifyId(
      createLikeDto.spotify_id
    );

    const nodeId: string = item.get('instance')['properties']['id'];
    return this.likeService.createLike(user, nodeId);
  }

  @Post('/db')
  async createLikeFromDb(
    @Body() createDeleteLikeDb: CreateDeleteLikeDto,
    @GetUser() user
  ) {
    return this.likeService.createLike(user, createDeleteLikeDb.nodeId);
  }

  @Delete()
  async deleteLike(
    @Query() createLikeDto: CreateDeleteLikeSpotifyDto,
    @GetUser() user
  ) {
    const [item] = await this.dbManager.findNodeBySpotifyId(
      createLikeDto.spotify_id
    );

    const nodeId: string = item.get('instance')['properties']['id'];
    return this.likeService.deleteLike(user, nodeId);
  }

  @Delete('/db')
  async deleteLikeFromDb(
    @Query() createDeleteLikeDb: CreateDeleteLikeDto,
    @GetUser() user
  ) {
    return this.likeService.deleteLike(user, createDeleteLikeDb.nodeId);
  }

  @Get('all')
  async getUserLikes(@GetUser() user: User) {
    const nodeIdsUserLikes = (await this.likeService.findUserLikes(user)).map(
      (value) => value.nodeId
    );

    const idsArray = nodeIdsUserLikes.map((value) => `'${value}'`).join(', ');

    const allLikes = await this.dbManager.getAllLikedInstances(idsArray);

    return allLikes.map((likeObj) => likeObj['p']);
  }

  @Get('/recommendations')
  async getRecommendations(@GetUser() user: User) {
    const nodeIdsUserLikes = (await this.likeService.findUserLikes(user)).map(
      (value) => value.nodeId
    );

    const relatedItemsAsList = nodeIdsUserLikes
      .map((value) => `'${value}'`)
      .join(', ');
    
    console.log(relatedItemsAsList);

    // this.http.get(`https://kmeans-rec-system.onrender.com/entities?like_ids=4kJDe36c1CCYkRetEHYkYO+4Z8W4fKeB5YxbusRsdQVPb`).subscribe((response) => {
    //   console.log(response, 'server response');
    // });

    const genres = (
      await this.dbManager.getGenresRecommendations(relatedItemsAsList)
    )
      .map((value) => value.toObject())
      .map((obj) => obj['other']['properties']);

    const artists = (
      await this.dbManager.getArtistRecommendations(relatedItemsAsList)
    )
      .map((value) => value.toObject())
      .map((obj) => obj['other']['properties']);

    const albums = (
      await this.dbManager.getAlbumRecommendations(relatedItemsAsList)
    )
      .map((value) => value.toObject())
      .map((obj) => obj['other']['properties']);

    const tracks = (
      await this.dbManager.getTrackRecommendations(relatedItemsAsList)
    )
      .map((value) => value.toObject())
      .map((obj) => obj['other']['properties']);

    return { albums, genres, artists, tracks };
  }
}
