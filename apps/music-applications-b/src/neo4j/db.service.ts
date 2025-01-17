import { Injectable } from '@nestjs/common';
import { Neo4jService, Transaction } from 'nest-neo4j/dist';
import { SpotifyService } from '../spotify/spotify.service';
import {
  AddTransactionResult,
  AlbumModel,
  AlbumProperties,
  AlbumWithRelationships,
  ArtistModel,
  ArtistProperties,
  ArtistWithRelationships,
  DatabaseItemPreview,
  GenreModel,
  GenreProperties,
  GenreWithRelationships,
  PlaylistModel,
  PlaylistProperties,
  PlaylistWithRelationships,
  SearchResult,
  TrackModel,
  TrackProperties,
  TrackWithRelationships,
  TransactionData,
} from './types';

import { v4 as generateId } from 'uuid';

// TODO: Refactor access modifier & methods
@Injectable()
export class DatabaseService {
  constructor(
    private readonly dbService: Neo4jService,
    private readonly spotifyService: SpotifyService
  ) {}

  // need to add search playlist function
  // need some serious refactoring
  private searchArtistQuery = (artistName: string) =>
    `MATCH (obj: Artist) WHERE ToLower(obj.name) CONTAINS "${artistName}" return obj`;

  private searchAlbumQuery = (albumTitle: string) =>
    `MATCH (obj: Album) WHERE ToLower(obj.name) CONTAINS "${albumTitle}" return obj`;

  private searchGenreQuery = (genreKind: string) =>
    `MATCH (obj: Genre) WHERE ToLower(obj.name) CONTAINS "${genreKind}" return obj`;

  private searchTrackQuery = (songTitle: string) =>
    `MATCH (obj: Track) WHERE ToLower(obj.name) CONTAINS "${songTitle}" return obj`;

  private searchPlaylistQuery = (playlistName: string) =>
    `MATCH (obj: Playlist) WHERE ToLower(obj.name) CONTAINS "${playlistName}" return obj`;

  private searchFunctions = [
    this.searchArtistQuery,
    this.searchAlbumQuery,
    this.searchGenreQuery,
    this.searchTrackQuery,
    this.searchPlaylistQuery,
  ];

  private collectQuery(instance: string, query: string): string {
    switch (instance) {
      case 'all':
        return this.searchFunctions.map((func) => func(query)).join(' UNION ');
      case 'artist':
        return this.searchArtistQuery(query);
      case 'track':
        return this.searchTrackQuery(query);
      case 'album':
        return this.searchAlbumQuery(query);
      case 'genre':
        return this.searchGenreQuery(query);
      case 'playlist':
        return this.searchPlaylistQuery(query);
    }
  }

  public async getData(query: {
    [searchType: string]: string;
  }): Promise<SearchResult[]> {
    const [instance, searchWord] = Object.entries(query).at(0);

    const result = await this.dbService.read(
      this.collectQuery(instance, searchWord)
    );

    return result.records
      .map((record) => record['_fields'].at(0))
      .map((recordFields) => {
        return {
          type: recordFields.labels.at(0),
          label: recordFields.properties.name,
          database_id: recordFields.properties.id,
          spotify_id: recordFields.properties.spotify_id ?? 'Not provided',
        } as SearchResult;
      });
  }

  private findNodeAndRelationsWithId = async (id: string, type: string) => {
    const res = await this.dbService.read(
      `MATCH (obj: ${type} { id: "${id}" })-[rel]-(o_obj) return obj, rel, o_obj`
    );

    return res.records;
  };

  public getNodesWithType = async (type: string) => {
    const res = (
      await this.dbService.read(`MATCH (obj: ${type}) return obj`)
    ).records
      .map((value) => value['_fields'])
      .flat();
    return res.map((node) => node.properties);
  };

  private async getNeo4jData(id: string, type: string) {
    const nodeWithRelationships = (
      await this.findNodeAndRelationsWithId(id, type)
    ).map((value) => value['_fields']);

    const node = nodeWithRelationships[0][0];
    const relationships = nodeWithRelationships.map((object) => {
      return { relName: object[1].type, targetOrSource: object[2] };
    });

    return { node, relationships };
  }

  // add labels guard to all relationships ??
  public async getGenreFull(id: string): Promise<GenreWithRelationships> {
    const { node, relationships } = await this.getNeo4jData(id, 'Genre');

    return {
      properties: node.properties as GenreProperties,
      albums: relationships
        .filter(
          (rel) =>
            rel.relName === 'RelatedToGenre' &&
            rel.targetOrSource.labels.at(0) === 'Album'
        )
        .map((rel) => rel.targetOrSource.properties as AlbumProperties),
      artists: relationships
        .filter((rel) => rel.relName === 'PerformsInGenre')
        .map((rel) => rel.targetOrSource.properties as ArtistProperties),
      playlists: relationships
        .filter(
          (rel) =>
            rel.relName === 'RelatedToGenre' &&
            rel.targetOrSource.labels.at(0) === 'Playlist'
        )
        .map((rel) => rel.targetOrSource.properties as PlaylistProperties),
    };
  }

  public async getArtistFull(id: string): Promise<ArtistWithRelationships> {
    const { node, relationships } = await this.getNeo4jData(id, 'Artist');

    return {
      properties: node.properties as ArtistProperties,
      tracksAuthor: relationships
        .filter(
          (rel) =>
            rel.relName === 'Author' &&
            rel.targetOrSource.labels.at(0) === 'Track'
        )
        .map((rel) => rel.targetOrSource.properties as TrackProperties),
      tracksContributor: relationships
        .filter(
          (rel) =>
            rel.relName === 'AppearedAt' &&
            rel.targetOrSource.labels.at(0) === 'Track'
        )
        .map((rel) => rel.targetOrSource.properties as TrackProperties),
      albumAuthor: relationships
        .filter(
          (rel) =>
            rel.relName === 'Author' &&
            rel.targetOrSource.labels.at(0) === 'Album'
        )
        .map((rel) => rel.targetOrSource.properties as AlbumProperties),
      albumContributor: relationships
        .filter(
          (rel) =>
            rel.relName === 'AppearedAt' &&
            rel.targetOrSource.labels.at(0) === 'Album'
        )
        .map((rel) => rel.targetOrSource.properties as AlbumProperties),
      genres: relationships
        .filter((rel) => rel.relName === 'PerformsInGenre')
        .map((rel) => rel.targetOrSource.properties as GenreProperties),
    };
  }

  public async getTrackFull(id: string): Promise<TrackWithRelationships> {
    const { node, relationships } = await this.getNeo4jData(id, 'Track');

    return {
      properties: node.properties as TrackProperties,
      author:
        relationships
          .filter((rel) => rel.relName === 'Author')
          .map((rel) => rel.targetOrSource.properties as ArtistProperties)
          .at(0) ?? null,
      contributors: relationships
        .filter((rel) => rel.relName === 'AppearedAt')
        .map((rel) => rel.targetOrSource.properties as ArtistProperties),
      album:
        relationships
          .filter(
            (rel) =>
              rel.relName === 'Contains' &&
              rel.targetOrSource.labels.at(0) === 'Album'
          )
          .map((rel) => rel.targetOrSource.properties as AlbumProperties)
          .at(0) ?? null,
      playlists: relationships
        .filter(
          (rel) =>
            rel.relName === 'Contains' &&
            rel.targetOrSource.labels.at(0) === 'Playlist'
        )
        .map((rel) => rel.targetOrSource.properties as PlaylistProperties),
    };
  }

  public async getAlbumFull(id: string): Promise<AlbumWithRelationships> {
    const { node, relationships } = await this.getNeo4jData(id, 'Album');

    return {
      properties: node.properties as AlbumProperties,
      genres: relationships
        .filter((rel) => rel.relName === 'RelatedToGenre')
        .map((rel) => rel.targetOrSource.properties as GenreProperties),
      author:
        relationships
          .filter((rel) => rel.relName === 'Author')
          .map((rel) => rel.targetOrSource.properties as ArtistProperties)
          .at(0) ?? null,
      contributors: relationships
        .filter((rel) => rel.relName === 'AppearedAt')
        .map((rel) => rel.targetOrSource.properties as ArtistProperties),
      tracks: relationships
        .filter((rel) => rel.relName === 'Contains')
        .map((rel) => rel.targetOrSource.properties as TrackProperties),
    };
  }

  public async getPlaylistFull(id: string): Promise<PlaylistWithRelationships> {
    const { node, relationships } = await this.getNeo4jData(id, 'Playlist');
    return {
      properties: node.properties as PlaylistProperties,
      tracks: relationships
        .filter((rel) => rel.relName === 'Contains')
        .map((rel) => rel.targetOrSource.properties as TrackProperties),
      genres: relationships
        .filter((rel) => rel.relName === 'RelatedToGenre')
        .map((rel) => rel.targetOrSource.properties as GenreProperties),
    };
  }

  /*
    // LIST GENRES TO PLAYLIST
     list of instances: artist, track, album, playlist, genre
     list of relations:
        :Author between artist and track/album
        :AppearedAt between artist and track/album <- fits for sub instances
        :PerformsInGenre between artist and genre
        :RelatedToGenre between album and genre
        :Contains between album/playlist and track

     algorithm for adding instances:
      1. Check whether instance is already existing in db.
      2. Check existence of all sub instances.
      3. Create instance if needed.
      4. Create sub instances {also get them from spotify by id, if necessary}.
      5. Provide relations.
  */

  public findNodeBySpotifyId = async (spotifyId: string) => {
    const res = await this.dbService.read(
      `MATCH (instance) WHERE instance.spotify_id = '${spotifyId}' RETURN instance;`
    );
    return res.records;
  };

  public async getDbStats() {
    // unwrap queries
    const nodesCount = (
      await this.dbService.read(`MATCH (n) RETURN count(n) AS nodeCount`)
    ).records[0]['_fields']
      .map((obj: { low: number }) => obj.low)
      .at(0);

    const relationshipsCount = (
      await this.dbService.read(
        `MATCH ()-[r]->() RETURN count(r) AS relationshipCount`
      )
    ).records[0]['_fields']
      .map((obj: { low: number }) => obj.low)
      .at(0);

    return [nodesCount, relationshipsCount];
  }

  public async getMostLikedItems(): Promise<any[]> {
    const records = (
      await this.dbService.read(`MATCH (n) WHERE n.likes > 0 RETURN n`)
    ).records.map((value) => value['_fields']);

    return records.map(([record]) => {
      return { itemType: record.labels.at(0).toLowerCase(), properties: record.properties };
    });
  }

  public async getNodesShort(
    nodeIds: string[]
  ): Promise<DatabaseItemPreview[]> {
    const utility = async (type: string) =>
      (
        await this.dbService.read(
          `MATCH (n: ${type}) WHERE n.id IN ${JSON.stringify(
            nodeIds
          )} RETURN n.id AS databaseId, n.name AS label, n.image AS image`
        )
      ).records;

    const genres = (await utility('Genre')).map((recordShape) => {
      return {
        label: String(recordShape.get('label')),
        databaseId: String(recordShape.get('databaseId')),
        image: String(recordShape.get('image')),
        type: 'genre',
      };
    });

    const artists = (await utility('Artist')).map((recordShape) => {
      return {
        label: String(recordShape.get('label')),
        databaseId: String(recordShape.get('databaseId')),
        image: String(recordShape.get('image')),
        type: 'artist',
      };
    });

    const albums = (await utility('Album')).map((recordShape) => {
      return {
        label: String(recordShape.get('label')),
        databaseId: String(recordShape.get('databaseId')),
        image: String(recordShape.get('image')),
        type: 'album',
      };
    });

    const tracks = (await utility('Track')).map((recordShape) => {
      return {
        label: String(recordShape.get('label')),
        databaseId: String(recordShape.get('databaseId')),
        image: String(recordShape.get('image')),
        type: 'track',
      };
    });

    const playlists = (await utility('Playlist')).map((recordShape) => {
      return {
        label: String(recordShape.get('label')),
        databaseId: String(recordShape.get('databaseId')),
        image: String(recordShape.get('image')),
        type: 'playlist',
      };
    });

    return [...genres, ...artists, ...albums, ...tracks, ...playlists];
  }

  public async getUserAddedNodes(
    username: string
  ): Promise<DatabaseItemPreview[]> {
    const utility = async (type: string) =>
      (
        await this.dbService.read(
          `MATCH (n: ${type}) WHERE n.added_by = "${username}" RETURN n.id AS databaseId, n.name AS label, n.image AS image`
        )
      ).records;

    const genres = (await utility('Genre')).map((recordShape) => {
      return {
        label: String(recordShape.get('label')),
        databaseId: String(recordShape.get('databaseId')),
        image: String(recordShape.get('image')),
        type: 'genre',
      };
    });

    const artists = (await utility('Artist')).map((recordShape) => {
      return {
        label: String(recordShape.get('label')),
        databaseId: String(recordShape.get('databaseId')),
        image: String(recordShape.get('image')),
        type: 'artist',
      };
    });

    const albums = (await utility('Album')).map((recordShape) => {
      return {
        label: String(recordShape.get('label')),
        databaseId: String(recordShape.get('databaseId')),
        image: String(recordShape.get('image')),
        type: 'album',
      };
    });

    const tracks = (await utility('Track')).map((recordShape) => {
      return {
        label: String(recordShape.get('label')),
        databaseId: String(recordShape.get('databaseId')),
        image: String(recordShape.get('image')),
        type: 'track',
      };
    });

    const playlists = (await utility('Playlist')).map((recordShape) => {
      return {
        label: String(recordShape.get('label')),
        databaseId: String(recordShape.get('databaseId')),
        image: String(recordShape.get('image')),
        type: 'playlist',
      };
    });

    return [...genres, ...artists, ...albums, ...tracks, ...playlists];
  }

  public async getAllLikedInstances(separatedIds: string) {
    const query = await this.dbService.read(`
      UNWIND [${separatedIds}] AS X
      MATCH (p {id: X})
      RETURN p
      `);

    const results = query.records.map((value) => value.toObject());

    return results;
  }

  public async increaseItemLikeCounter(nodeId: string) {
    const query = await this.dbService.write(`
      MATCH (item { id: "${nodeId}"})
      SET item.likes = item.likes + 1
      RETURN item
    `);

    return query;
  }

  public async getGenresRecommendations(separatedIds: string) {
    const query = await this.dbService.read(`
      UNWIND [${separatedIds}] AS X
      MATCH (p{id: X})  
      WITH p as everything
      CALL{

      WITH everything
      MATCH (everything)--(art:Artist)--(other:Genre)
      WHERE everything <> other
      RETURN other
      LIMIT 3

      UNION

      WITH everything
      MATCH (everything:Artist)--(other:Genre)
      RETURN other
      LIMIT 3

      }
      RETURN DISTINCT other
      LIMIT 10
    `);

    return query.records;
  }

  public async getAlbumRecommendations(separatedIds: string) {
    const query = await this.dbService.read(`
    UNWIND [${separatedIds}] AS X
    MATCH (p{id: X})  
    WITH p as everything
    CALL{
        WITH everything
        MATCH (everything)--(art:Artist)--(other:Album)
        WHERE everything <> other
        RETURN other
        LIMIT 3
    
        UNION
    
        WITH everything
        MATCH (everything:Artist)--(other:Album)
        RETURN other
        LIMIT 3
    
    }
    RETURN DISTINCT other
    LIMIT 10`);

    return query.records;
  }

  public async getTrackRecommendations(separatedIds: string) {
    const query = await this.dbService.read(`
    UNWIND [${separatedIds}] AS X
    MATCH (p{id: X})  
    WITH p as everything
    CALL{
        WITH everything
        MATCH (everything)--(art:Artist)--(other:Track)
        WHERE everything <> other
        RETURN other
        LIMIT 3
    
        UNION
    
        WITH everything
        MATCH (everything:Artist)--(other:Track)
        RETURN other
        LIMIT 3
    
    }
    RETURN DISTINCT other
    LIMIT 10
    `);

    return query.records;
  }

  public async getArtistRecommendations(separatedIds: string) {
    const query = await this.dbService.read(`
    UNWIND [${separatedIds}] AS X
    MATCH (p{id: X})  
    WITH p as everything
    CALL{
        WITH everything
        MATCH (everything)--(art:Artist)--(gen:Genre)--(other:Artist)
        WHERE everything <> other
        RETURN other
        LIMIT 3
    
        UNION
    
        WITH everything
        MATCH (everything:Artist)--(gen:Genre)--(other:Artist)
        WHERE everything <> other
        RETURN other
        LIMIT 3
    
    }
    RETURN DISTINCT other
    LIMIT 10
    `);

    return query.records;
  }

  /* ADD functions */
  public performAddTransaction = async (
    type: string,
    spotifyId: string,
    username: string
  ): Promise<AddTransactionResult> => {
    const txData: TransactionData = {
      records: [],
      relationshipCount: 0,
    };

    const session = this.dbService.getDriver().session();
    const transaction = await session.beginTransaction();

    try {
      switch (type) {
        case 'track':
          await this.addTrackFromSpotify(
            spotifyId,
            username,
            txData,
            transaction
          );
          break;
        case 'album':
          await this.addAlbumFromSpotify(
            spotifyId,
            username,
            txData,
            transaction
          );
          break;
        case 'artist':
          await this.addArtistFromSpotify(
            spotifyId,
            username,
            txData,
            transaction
          );
          break;
        case 'playlist':
          await this.addPlaylistFromSpotify(
            spotifyId,
            username,
            txData,
            transaction
          );
          break;
      }

      await transaction.commit();
    } catch (error) {
      // await transaction.rollback();
      return {
        isSuccess: false,
        reason: JSON.stringify(error.message),
        data: { records: [], relationshipCount: 0 },
      };
    } finally {
      await transaction.close();
      await session.close();
    }

    if (txData.records.length > 0) {
      return {
        isSuccess: true,
        data: txData,
      };
    } else {
      return {
        isSuccess: false,
        data: txData,
        reason: 'Record was already added.',
      };
    }
  };

  /* ADD TO DB FUNCTIONS */

  public async instanceWithIdExistsWithTransaction(
    id: string,
    transaction: Transaction
  ) {
    const query = await transaction.run(
      `MATCH (instance) WHERE instance.spotify_id = "${id}" RETURN instance`
    );

    return query.records.length != 0;
  }

  public async instanceWithIdExists(id: string) {
    const query = await this.dbService.read(
      `MATCH (instance) WHERE instance.spotify_id = "${id}" RETURN instance`
    );

    return query.records.length != 0;
  }

  public async instanceWithNameExists(
    name: string,
    instanceType: string,
    transaction: Transaction
  ) {
    const searchResults = await transaction.run(
      `MATCH (instance: ${instanceType}) WHERE instance.name = "${name}" RETURN instance`
    );

    return searchResults.records.length !== 0;
  }

  public async addGenre(
    model: GenreModel,
    username: string,
    transactionData: TransactionData,
    transaction: Transaction
  ): Promise<boolean> {
    const isExists = await this.instanceWithNameExists(
      model.name,
      'Genre',
      transaction
    );

    if (isExists) {
      return false;
    }

    const genId = String(generateId());
    await transaction.run(`
      CREATE (genre: Genre {
        name: "${model.name}",
        description: "${model.description}",
        image: "${model.image}",
        added_by: "${username}",
        likes: 0,
        id: "${genId}"
      })
      `);

    transactionData.records.push({ type: 'genre', name: model.name });
    return true;
  }

  public async addArtistFromSpotify(
    spotifyId: string,
    username: string,
    transactionData: TransactionData,
    transaction: Transaction
  ): Promise<boolean> {
    const isExists = await this.instanceWithIdExistsWithTransaction(
      spotifyId,
      transaction
    );

    if (isExists) {
      return false;
    }

    const artist = await this.spotifyService.getArtistById(spotifyId);
    return await this.addArtistFromSpotifyFetched(
      artist,
      username,
      transactionData,
      transaction,
      false
    );
  }

  public async addArtistFromSpotifyFetched(
    artist: SpotifyApi.SingleArtistResponse | SpotifyApi.ArtistObjectFull,
    username: string,
    transactionData: TransactionData,
    transaction: Transaction,
    checkForDuplicate: boolean
  ) {
    if (checkForDuplicate) {
      const isExists = await this.instanceWithIdExistsWithTransaction(
        artist.id,
        transaction
      );

      if (isExists) {
        return false;
      }
    }

    const genId = String(generateId());
    const imageUrl: string = artist.images?.[0]?.url ?? 'Not provided';

    await transaction.run(`
      CREATE (artist: Artist {
        name: "${artist.name}",
        description: "Not provided",
        type: "${artist.type}",
        image: "${imageUrl}",
        added_by: "${username}",
        spotify_id: "${artist.id}",
        likes: 0,
        id: "${genId}"
      })
    `);

    transactionData.records.push({ type: 'artist', name: artist.name });

    for (const genreName of artist.genres) {
      await this.addGenre(
        { name: genreName, image: 'Not provided', description: 'Not provided' },
        username,
        transactionData,
        transaction
      );
    }

    const relsArtistToGenre = await Promise.allSettled(
      artist.genres.map((genreName) =>
        transaction.run(`
        MATCH
          (artist: Artist {spotify_id: "${artist.id}"}),
          (genre: Genre {name: "${genreName}"})
        MERGE (artist)-[r:PerformsInGenre]->(genre)
        RETURN type(r)
    `)
      )
    );

    transactionData.relationshipCount += relsArtistToGenre.length;
    return true;
  }

  public async addArtist(
    model: ArtistModel,
    username: string,
    transactionData: TransactionData,
    transaction: Transaction
  ): Promise<boolean> {
    // user is sure that there is no duplicate => no need to check for it
    const genId = String(generateId());
    await transaction.run(`
      CREATE (artist: Artist {
        name: "${model.name}",
        description: "${model.description}",
        type: "${model.type}",
        image: "${model.image}",
        spotify_id: "Not provided",
        added_by: "${username}",
        likes: 0,
        id: "${genId}"
      })
    `);

    transactionData.records.push({ type: 'artist', name: model.name });

    const relsArtistGenre = await Promise.allSettled(
      model.relatedGenresIds.map((genreNodeId) =>
        transaction.run(`
          MATCH
            (artist: Artist {id: "${genId}"}),
            (genre: Genre {id: "${genreNodeId}"})
          MERGE (artist)-[r:PerformsInGenre]->(genre)
          RETURN type(r)
    `)
      )
    );

    transactionData.relationshipCount += relsArtistGenre.length;

    return true;
  }

  public async addTrackFromSpotify(
    spotifyId: string,
    username: string,
    transactionData: TransactionData,
    transaction: Transaction
  ): Promise<boolean> {
    const isExists = await this.instanceWithIdExistsWithTransaction(
      spotifyId,
      transaction
    );

    if (isExists) {
      return false;
    }

    const track = await this.spotifyService.getTrackById(spotifyId);
    return await this.addTrackFromSpotifyFetched(
      track,
      username,
      transactionData,
      transaction,
      false
    );
  }

  public async addTrackFromSpotifyFetched(
    track: SpotifyApi.TrackObjectFull | SpotifyApi.SingleTrackResponse,
    username: string,
    transactionData: TransactionData,
    transaction: Transaction,
    checkForDuplicate: boolean
  ) {
    if (checkForDuplicate) {
      const isExists = await this.instanceWithIdExistsWithTransaction(
        track.id,
        transaction
      );

      if (isExists) {
        return false;
      }
    }

    const genId = String(generateId());
    const imageUrl: string = track.album.images?.[0]?.url ?? 'Not provided';

    await transaction.run(`
      CREATE (track: Track {
        name: "${track.name.replace(`"`, '')}",
        duration_ms: "${String(track.duration_ms)}",
        explicit: "${track.explicit}",
        type: "${track.type}",
        image: "${imageUrl}",
        added_by: "${username}",
        spotify_id: "${track.id}",
        likes: 0,
        id: "${genId}"
      })`);

    transactionData.records.push({ type: 'track', name: track.name });

    for (const simplifiedArtist of track.artists) {
      await this.addArtistFromSpotify(
        simplifiedArtist.id,
        username,
        transactionData,
        transaction
      );
    }

    const trackAuthor = track.artists.shift();
    await transaction.run(`
      MATCH
        (artist: Artist {spotify_id: "${trackAuthor.id}"}),
        (track: Track {spotify_id: "${track.id}"})
      MERGE (artist)-[r:Author]->(track)
      RETURN type(r)
      `);

    transactionData.relationshipCount++;

    const relsTrackArtist = await Promise.allSettled(
      track.artists.map((artist) =>
        transaction.run(`
          MATCH
            (artist: Artist {spotify_id: "${artist.id}"}),
            (track: Track {spotify_id: "${track.id}"})
          MERGE (artist)-[r:AppearedAt]->(track)
          RETURN type(r)`)
      )
    );

    transactionData.relationshipCount += relsTrackArtist.length;
    return true;
  }

  public async addTrack(
    model: TrackModel,
    username: string,
    transactionData: TransactionData,
    transaction: Transaction
  ) {
    const genId = String(generateId());
    await transaction.run(`
      CREATE (track: Track {
        name: "${model.name}",
        duration_ms: "${String(model.durationMs)}",
        explicit: "${model.explicit}",
        type: "${model.type}",
        image: "${model.image}",
        added_by: "${username}",
        spotify_id: "Not provided",
        likes: 0,
        id: "${genId}"
      })`);

    transactionData.records.push({ name: model.name, type: 'track' });

    await transaction.run(`
      MATCH
        (artist: Artist {id: "${model.authorId}"}),
        (track: Track {id: "${genId}"})
      MERGE (artist)-[r:Author]->(track)`);

    transactionData.relationshipCount++;

    const relsArtistTrack = await Promise.allSettled(
      model.contributorsIds.map((cId) =>
        transaction.run(`
          MATCH
            (artist: Artist {id: "${cId}"}),
            (track: Track {id: "${genId}"})
          MERGE (artist)-[r:AppearedAt]->(track)
          RETURN type(r)
        `)
      )
    );

    transactionData.relationshipCount += relsArtistTrack.length;

    return true;
  }

  public async addPlaylistFromSpotify(
    spotifyId: string,
    username: string,
    transactionData: TransactionData,
    transaction: Transaction
  ) {
    const isExists = await this.instanceWithIdExistsWithTransaction(
      spotifyId,
      transaction
    );
    if (isExists) {
      return false;
    }

    // TODO: is there a need for adding genres to playlist??????
    const playlist = await this.spotifyService.getPlaylistById(spotifyId);
    const playlistTracks = await this.spotifyService.getAllTracksFromPlaylist(
      playlist.id
    );

    const artistIds = [
      ...new Set(
        playlistTracks
          .map((track) => track.track.artists?.map((artist) => artist.id))
          .flat()
      ),
    ];

    const artistsFetched = await Promise.all(
      artistIds.map((id) => this.spotifyService.getArtistById(id))
    );

    const genres = [
      ...new Set(artistsFetched.map((artist) => artist.genres).flat()),
    ];

    const genId = String(generateId());
    const imageUrl: string = playlist.images?.[0]?.url ?? 'Not provided';

    await transaction.run(`
      CREATE (playlist: Playlist {
        name: "${playlist.name}",
        description: "${playlist.description}",
        owner_name: "${playlist.owner.display_name}",
        spotify_id: "${spotifyId}",
        image: "${imageUrl}",
        added_by: "${username}",
        likes: 0,
        id: "${genId}"
      })
    `);

    transactionData.records.push({ type: 'playlist', name: playlist.name });

    // add all artists
    for (const artist of artistsFetched) {
      await this.addArtistFromSpotifyFetched(
        artist,
        username,
        transactionData,
        transaction,
        true
      );
    }

    // add all tracks
    for (const playlistTrack of playlistTracks) {
      await this.addTrackFromSpotifyFetched(
        playlistTrack.track,
        username,
        transactionData,
        transaction,
        true
      );
    }

    const relsPlaylistTrack = await Promise.all(
      playlistTracks.map((track) =>
        transaction.run(`
        MATCH
          (playlist: Playlist {spotify_id: "${spotifyId}"}),
          (track: Track {spotify_id: "${track.track.id}"})
        MERGE (playlist)-[r:Contains]->(track)
        RETURN type(r)`)
      )
    );

    transactionData.relationshipCount += relsPlaylistTrack.length;

    const relsPlaylistGenre = await Promise.all(
      genres.map((genreName) =>
        transaction.run(`
          MATCH
            (playlist: Playlist {spotify_id: "${spotifyId}"}),
            (genre: Genre {name: "${genreName}"})
          MERGE (playlist)-[r:RelatedToGenre]->(genre)
          RETURN type(r)
        `)
      )
    );

    transactionData.relationshipCount += relsPlaylistGenre.length;
    return true;
  }

  public async addPlaylist(
    model: PlaylistModel,
    username: string,
    transactionData: TransactionData,
    transaction: Transaction
  ) {
    const genId = String(generateId());

    await transaction.run(`
      CREATE (playlist: Playlist {
        name: "${model.name}",
        description: "${model.description}",
        owner_name: "${model.ownerName}",
        spotify_id: "Not provided",
        image: "${model.image}",
        added_by: "${username}",
        likes: 0,
        id: "${genId}"
      })`);

    transactionData.records.push({ name: model.name, type: 'playlist' });

    const relsPlaylistTrack = await Promise.allSettled(
      model.tracksIds.map((trackId) =>
        transaction.run(`
        MATCH
          (playlist: Playlist {id: "${genId}"}),
          (track: Track {id: "${trackId}"})
        MERGE (playlist)-[r:Contains]->(track)
        RETURN type(r)
      `)
      )
    );

    const relsPlaylistGenre = await Promise.allSettled(
      model.genresIds.map((genreId) =>
        transaction.run(`
          MATCH
            (playlist: Playlist {id: "${genId}"}),
            (genre: Genre {id: "${genreId}"})
          MERGE (playlist)-[r:RelatedToGenre]->(genre)
          RETURN type(r)
        `)
      )
    );

    transactionData.relationshipCount += relsPlaylistTrack.length;
    transactionData.relationshipCount += relsPlaylistGenre.length;

    return true;
  }

  public async addAlbumFromSpotify(
    spotifyId: string,
    username: string,
    transactionData: TransactionData,
    transaction: Transaction
  ) {
    const isExists = await this.instanceWithIdExistsWithTransaction(
      spotifyId,
      transaction
    );
    if (isExists) {
      return false;
    }

    const album = await this.spotifyService.getAlbumById(spotifyId);
    const genId = String(generateId());
    const imageUrl: string = album.images?.[0]?.url ?? 'Not provided';

    await transaction.run(`
      CREATE (album: Album {
        name: "${album.name}",
        type: "${album.album_type}",
        count_of_tracks: "${album.total_tracks}",
        label: "${album.label}",
        release_date: "${album.release_date}",
        image: "${imageUrl}",
        spotify_id: "${spotifyId}",
        added_by: "${username}",
        likes: 0,
        id: "${genId}" 
      })
    `);

    transactionData.records.push({ type: 'album', name: album.name });

    // spotify object album never contains genres of artist that related to album
    // solution: get all artists from spotify then parse it's genres, fetched artists add by their model, without making duplicate request
    const artistsFetched = await Promise.all(
      album.artists.map((simplifiedArtist) =>
        this.spotifyService.getArtistById(simplifiedArtist.id)
      )
    );

    for (const artist of artistsFetched) {
      await this.addArtistFromSpotifyFetched(
        artist,
        username,
        transactionData,
        transaction,
        true
      );
    }

    const allArtistsGenres = [
      ...new Set(artistsFetched.map((artists) => artists.genres).flat()),
    ];

    await Promise.allSettled(
      allArtistsGenres.map((genreName) =>
        transaction.run(`
          MATCH
            (album: Album {spotify_id: "${spotifyId}"}),
            (genre: Genre {name: "${genreName}"})
          MERGE (album)-[r:RelatedToGenre]->(genre)
          RETURN type(r)
    `)
      )
    );

    transactionData.relationshipCount += allArtistsGenres.length;

    const albumAuthor = album.artists.shift();
    await transaction.run(`
      MATCH
        (artist: Artist {spotify_id: "${albumAuthor.id}"}),
        (album: Album {spotify_id: "${spotifyId}"})
      MERGE (artist)-[r:Author]->(album)
      RETURN type(r)`);

    transactionData.relationshipCount++;

    const relsArtistAlbum = await Promise.allSettled(
      album.artists.map((artist) =>
        transaction.run(`
          MATCH
            (artist: Artist {spotify_id: "${artist.id}"}),
            (album: Album {spotify_id: "${spotifyId}"})
          MERGE (artist)-[r:AppearedAt]->(album)
          RETURN type(r)
    `)
      )
    );

    transactionData.relationshipCount += relsArtistAlbum.length;

    for (const track of album.tracks.items) {
      await this.addTrackFromSpotify(
        track.id,
        username,
        transactionData,
        transaction
      );
    }

    const relsAlbumTrack = await Promise.allSettled(
      album.tracks.items.map((track) =>
        transaction.run(`
          MATCH
            (album: Album {spotify_id: "${spotifyId}"}),
            (track: Track {spotify_id: "${track.id}"})
          MERGE (album)-[r:Contains]->(track)
          RETURN type(r)
      `)
      )
    );

    transactionData.relationshipCount += relsAlbumTrack.length;

    return true;
  }

  public async addAlbum(
    model: AlbumModel,
    username: string,
    transactionData: TransactionData,
    transaction: Transaction
  ) {
    const genId = String(generateId());

    await transaction.run(`
      CREATE (album: Album {
        name: "${model.name}",
        type: "${model.type}",
        count_of_tracks: "${model.countOfTracks}",
        label: "${model.label}",
        release_date: "${model.releaseDate}",
        image: "${model.image}",
        spotify_id: "Not provided",
        added_by: "${username}",
        likes: 0,
        id: "${genId}"
      })`);

    transactionData.records.push({ name: model.name, type: 'album' });

    await transaction.run(`
      MATCH
        (album: Album {id: "${genId}"}),
        (artist: Artist {id: "${model.authorId}"})
      MERGE (artist)-[r:Author]->(album)
      RETURN type(r)`);

    transactionData.relationshipCount++;

    const relsArtistsAlbum = await Promise.allSettled(
      model.contributorsIds.map((artistId) =>
        transaction.run(`
          MATCH
            (artist: Artist {id: "${artistId}"}),
            (album: Album {id: "${genId}"})
          MERGE (artist)-[r:AppearedAt]->(album)
          RETURN type(r)`)
      )
    );

    transactionData.relationshipCount += relsArtistsAlbum.length;

    const relsAlbumGenre = await Promise.allSettled(
      model.relatedGenresIds.map((genreId) =>
        transaction.run(`
          MATCH
            (album: Album {id: "${genId}"}),
            (genre: Genre {id: "${genreId}"})
          MERGE (album)-[r:RelatedToGenre]->(genre)
          RETURN type(r)`)
      )
    );

    transactionData.relationshipCount += relsAlbumGenre.length;

    const relsTracksAlbum = await Promise.allSettled(
      model.tracksIds.map((trackId) =>
        transaction.run(`
          MATCH
            (album: Album {id: "${genId}"}),
            (track: Track {id: "${trackId}"})
          MERGE (album)-[r:Contains]->(track)
          RETURN type(r)`)
      )
    );

    transactionData.relationshipCount += relsTracksAlbum.length;
    return true;
  }
}
