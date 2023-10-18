import { Injectable } from '@nestjs/common';
import { Neo4jService, Transaction } from 'nest-neo4j/dist';
import { SpotifyService } from '../spotify/spotify.service';
import {
  AddTransactionResult,
  AlbumModel,
  ArtistModel,
  GenreModel,
  PlaylistModel,
  TrackModel,
  TransactionData,
} from './types';

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

  public findNodeAndRelationsWithId = async (id: number, type: string) => {
    const res = await this.dbService.read(
      `MATCH (obj: ${type} { id: "${id}" })-[rel]-(o_obj) return obj, rel, o_obj`
    );

    return res.records;
  };

  public findNodeBySpotifyId = async (spotifyId: string) => {
    const res = await this.dbService.read(
      `MATCH (instance) WHERE instance.spotify_id = '${spotifyId}' RETURN instance;`
    );
    return res.records;
  };

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

  private unwrapQuery(query) {
    return Object.keys(query).map((key) => {
      return [key.toString(), query[key].toString()];
    });
  }

  public async getData(query) {
    const [params] = this.unwrapQuery(query);
    const result = await this.dbService.read(
      this.collectQuery(params[0], params[1])
    );
    return result;
  }

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

  public async getUserAddedNodes(
    username: string
  ): Promise<{ type: string; name: string; nodeId: number }[]> {
    const utility = async (type: string) =>
      (
        await this.dbService.read(
          `MATCH (n: ${type}) WHERE n.added_by = "${username}" RETURN n.id AS id, n.name AS name`
        )
      ).records;

    const genres = (await utility('Genre')).map((recordShape) => {
      return {
        name: String(recordShape.get('name')),
        nodeId: Number(recordShape.get('id')),
        type: 'genre',
      };
    });

    const artists = (await utility('Artist')).map((recordShape) => {
      return {
        name: String(recordShape.get('name')),
        nodeId: Number(recordShape.get('id')),
        type: 'artist',
      };
    });

    const albums = (await utility('Album')).map((recordShape) => {
      return {
        name: String(recordShape.get('name')),
        nodeId: Number(recordShape.get('id')),
        type: 'album',
      };
    });

    const tracks = (await utility('Track')).map((recordShape) => {
      return {
        name: String(recordShape.get('name')),
        nodeId: Number(recordShape.get('id')),
        type: 'track',
      };
    });

    const playlists = (await utility('Playlist')).map((recordShape) => {
      return {
        type: 'playlist',
        name: String(recordShape.get('name')),
        nodeId: Number(recordShape.get('id')),
      };
    });

    return [...genres, ...artists, ...albums, ...tracks, ...playlists];
  }

  public async getUserDbStats(username: string) {
    const nodesCount = (
      await this.dbService.read(
        `MATCH (n) WHERE n.added_by = "${username}" RETURN count(n) AS nodeCount`
      )
    ).records[0]['_fields']
      .map((obj: { low: number }) => obj.low)
      .at(0);

    const relationshipsCount = (
      await this.dbService.read(
        `MATCH (n)-[r]->() WHERE n.added_by = "${username}" RETURN count(r) AS relationshipCount`
      )
    ).records[0]['_fields']
      .map((obj: { low: number }) => obj.low)
      .at(0);

    return [nodesCount, relationshipsCount];
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

  public async generateNewNodeId(transaction: Transaction): Promise<number> {
    const query = await transaction.run(`MERGE (id:GlobalUniqueId)
      ON CREATE SET id.count = 1
      ON MATCH SET id.count = id.count + 1
      RETURN id.count AS generated_id`);

    const [recordId] = query.records;
    return recordId.get('generated_id')['low'];
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
      // maybe useless
      console.log(error, 'error in try');

      transaction.rollback();
      return {
        isSuccess: false,
        reason: error.message,
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
  /*
     list of instances: artist, track, album, playlist, genre
     list of relations:
        :author between artist and track(or album)
        :appeared between secondary artist and track(or album) <- fits for sub instances
        :performsIn between artist and genre
        :contains between album or playlist and track

     algorithm for adding instances:
      1. Check whether instance is already existing in db.
      2. Check existence of all sub instances.
      3. Create instance if needed.
      4. Create sub instances {also get them from spotify by id, if necessary}.
      5. Provide relations.
  */

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

    const genId = await this.generateNewNodeId(transaction);
    await transaction.run(`
      CREATE (genre: Genre {
        name: "${model.name}",
        description: "${model.description}",
        image: "${model.image}",
        added_by: "${username}",
        id: ${genId}
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
    const genId = await this.generateNewNodeId(transaction);

    const imageUrl: string = artist.images?.[0]?.url ?? 'Not provided';

    await transaction.run(`
      CREATE (artist: Artist {
        name: "${artist.name}",
        description: "Not provided",
        type: "${artist.type}",
        image: "${imageUrl}",
        added_by: "${username}",
        spotify_id: "${spotifyId}",
        id: "${genId}"
      })
    `);

    transactionData.records.push({ type: 'artist', name: artist.name });

    // adding related genres if ones doesn't exists
    await Promise.allSettled(
      artist.genres.map((genreName) =>
        this.addGenre(
          {
            name: genreName,
            image: 'Not provided',
            description: 'Not provided',
          },
          username,
          transactionData,
          transaction
        )
      )
    );

    const relsArtistToGenre = await Promise.allSettled(
      artist.genres.map((genreName) =>
        transaction.run(`
        MATCH
          (artist: Artist {spotify_id: "${spotifyId}"}),
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

    const genId = await this.generateNewNodeId(transaction);
    await transaction.run(`
      CREATE (artist: Artist {
        name: "${model.name}",
        description: "${model.description}",
        type: "${model.type}",
        image: "${model.image}",
        spotify_id: "Not provided",
        added_by: "${username}",
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
    const genId = await this.generateNewNodeId(transaction);

    const imageUrl: string = track.album.images?.[0]?.url ?? 'Not provided';

    await transaction.run(`
      CREATE (track: Track {
        name: "${track.name}",
        duration_ms: "${track.duration_ms}",
        explicit: "${track.explicit}",
        type: "${track.type}",
        image: "${imageUrl}",
        added_by: "${username}",
        id: "${genId}"
      })`);

    transactionData.records.push({ type: 'track', name: track.name });

    // add related artists
    await Promise.allSettled(
      track.artists.map((artist) =>
        this.addArtistFromSpotify(
          artist.id,
          username,
          transactionData,
          transaction
        )
      )
    );

    const trackAuthor = track.artists.shift();
    await transaction.run(`
      MATCH
        (artist: Artist {spotify_id: "${trackAuthor.id}"}),
        (track: Track {spotify_id: "${spotifyId}"})
      MERGE (artist)-[r:Author]->(track)
      RETURN type(r)
      `);

    transactionData.relationshipCount++;

    const relsTrackArtist = await Promise.allSettled(
      track.artists.map((artist) =>
        transaction.run(`
          MATCH
            (artist: Artist {spotify_id: "${artist.id}"}),
            (track: Track {spotify_id: "${spotifyId}"})
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
    const genId = await this.generateNewNodeId(transaction);
    await transaction.run(`
      CREATE (track: Track {
        name: "${model.name}",
        duration_ms: "${model.durationMs}",
        explicit: "${model.explicit}",
        type: "${model.type}",
        image: "${model.image}",
        added_by: "${username}",
        spotify_id: "Not provided",
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
    spotify_id: string,
    username: string,
    transactionData: TransactionData,
    transaction: Transaction
  ) {
    const isExists = await this.instanceWithIdExistsWithTransaction(
      spotify_id,
      transaction
    );
    if (isExists) {
      return false;
    }

    const playlist = await this.spotifyService.getPlaylistById(spotify_id);
    const genId = await this.generateNewNodeId(transaction);
    const imageUrl: string = playlist.images?.[0]?.url ?? 'Not provided';

    await transaction.run(`
      CREATE (playlist: Playlist {
        name: "${playlist.name}",
        description: "${playlist.description}",
        owner_name: "${playlist.owner.display_name}",
        spotify_id: "${spotify_id}",
        image: "${imageUrl}",
        added_by: "${username}",
        id: "${genId}"
      })
    `);

    transactionData.records.push({ type: 'playlist', name: playlist.name });

    await Promise.allSettled(
      playlist.tracks.items.map((track) =>
        this.addTrackFromSpotify(
          track.track.id,
          username,
          transactionData,
          transaction
        )
      )
    );

    const relsPlaylistTrack = await Promise.all(
      playlist.tracks.items.map((track) =>
        transaction.run(`
        MATCH
          (playlist: Playlist {spotify_id: "${spotify_id}"}),
          (track: Track {spotify_id: "${track.track.id}"})
        MERGE (playlist)-[r:Contains]->(track)
        RETURN type(r)`)
      )
    );

    transactionData.relationshipCount += relsPlaylistTrack.length;
    return true;
  }

  public async addPlaylist(
    model: PlaylistModel,
    username: string,
    transactionData: TransactionData,
    transaction: Transaction
  ) {
    const genId = await this.generateNewNodeId(transaction);

    await transaction.run(`
      CREATE (playlist: Playlist {
        name: "${model.name}",
        description: "${model.description}",
        owner_name: "${model.ownerName}",
        spotify_id: "Not provided",
        image: "${model.image}",
        added_by: "${username}",
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

    transactionData.relationshipCount += relsPlaylistTrack.length;

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
    const genId = await this.generateNewNodeId(transaction);
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
        id: "${genId}" 
      })
    `);

    transactionData.records.push({ type: 'album', name: album.name });

    await Promise.allSettled(
      album.genres.map((genreName) =>
        this.addGenre(
          {
            name: genreName,
            description: 'Not provided',
            image: 'Not provided',
          },
          username,
          transactionData,
          transaction
        )
      )
    );

    const relsAlbumGenre = await Promise.allSettled(
      album.genres.map((genreName) =>
        transaction.run(`
          MATCH
            (album: Album {spotify_id: "${spotifyId}"}),
            (genre: Genre {name: "${genreName}"})
          MERGE (album)-[r:RelatedToGenre]->(genre)
          RETURN type(r)`)
      )
    );

    transactionData.relationshipCount += relsAlbumGenre.length;

    await Promise.allSettled(
      album.artists.map((artist) =>
        this.addArtistFromSpotify(
          artist.id,
          username,
          transactionData,
          transaction
        )
      )
    );

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

    await Promise.allSettled(
      album.tracks.items.map((track) =>
        this.addTrackFromSpotify(
          track.id,
          username,
          transactionData,
          transaction
        )
      )
    );

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
    const genId = await this.generateNewNodeId(transaction);

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
