import { ApplicationConfig } from '../../../config/config';
import { Injectable } from '@nestjs/common';
import SpotifyWebApi = require('spotify-web-api-node');
import {
  SpotifyArtist,
  SpotifyAlbum,
  SpotifyPlaylist,
  SpotifyTrack,
} from './spotify-types';
import {
  extractSpotifyAlbumProperties,
  extractSpotifyArtistProperties,
  extractSpotifyPlaylistProperties,
  extractSpotifyTrackProperties,
} from './spotify-types.parser';
import { SearchResult } from '../neo4j/types';

@Injectable()
export class SpotifyService {
  public scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify',
  ];

  private spotifyWebApi!: SpotifyWebApi;

  public get SpotifyWebApi(): SpotifyWebApi {
    return this.spotifyWebApi;
  }

  constructor() {
    this.spotifyWebApi = new SpotifyWebApi({
      clientId: ApplicationConfig.clientId_spotify,
      clientSecret: ApplicationConfig.clientSecret_spotify,
      redirectUri: 'http://localhost:4200/api/callback',
    });
  }

  private searchFromWeb(instance: string, query: string) {
    switch (instance) {
      case 'all':
        return this.spotifyWebApi.search(query, [
          'album',
          'artist',
          'playlist',
          'track',
        ]);
      case 'track':
        return this.spotifyWebApi.searchTracks(query);
      case 'album':
        return this.spotifyWebApi.searchAlbums(query);
      case 'playlist':
        return this.spotifyWebApi.searchPlaylists(query);
      case 'artist':
        return this.spotifyWebApi.searchArtists(query);
    }
  }

  public async getWebData(query: {
    [searchType: string]: string;
  }): Promise<SearchResult[]> {
    const [instance, searchWord] = Object.entries(query).at(0);
    const searchResponse = await this.searchFromWeb(instance, searchWord);
    const result: SearchResult[] = [];
    const validArrayNames = ['albums', 'artists', 'tracks', 'playlists'];
    Object.entries(searchResponse.body).forEach(([key, value]) => {
      if (
        validArrayNames.includes(key) &&
        Array.isArray(value.items) &&
        value.items.length > 0
      ) {
        result.push(
          ...value.items.map((item) => {
            return {
              type: key.charAt(0).toUpperCase() + key.slice(1, -1),
              label: item.name,
              spotify_id: item.id,
            } as SearchResult;
          })
        );
      }
    });

    return result.sort((a, b) => a.label.localeCompare(b.label));
  }

  public async getParsedArtistById(spotify_id: string): Promise<SpotifyArtist> {
    return extractSpotifyArtistProperties(await this.getArtistById(spotify_id));
  }

  public async getParsedAlbumById(spotify_id: string): Promise<SpotifyAlbum> {
    return extractSpotifyAlbumProperties(await this.getAlbumById(spotify_id));
  }

  public async getParsedPlaylistById(
    spotify_id: string
  ): Promise<SpotifyPlaylist> {
    return extractSpotifyPlaylistProperties(
      await this.getPlaylistById(spotify_id)
    );
  }

  public async getParsedTrackById(spotify_id: string): Promise<SpotifyTrack> {
    return extractSpotifyTrackProperties(await this.getTrackById(spotify_id));
  }

  public async getArtistById(spotify_id: string) {
    const result = await this.SpotifyWebApi.getArtist(spotify_id);
    return result.body;
  }

  public async getAllTracksFromPlaylist(playlist_id: string) {
    const accumulatedTracks: SpotifyApi.PlaylistTrackObject[] = [];
    let currentBatch = (await this.spotifyWebApi.getPlaylistTracks(playlist_id))
      .body;

    accumulatedTracks.push(...currentBatch.items);

    while (currentBatch.next !== null) {
      currentBatch = (
        await this.spotifyWebApi.getPlaylistTracks(playlist_id, {
          offset: accumulatedTracks.length,
        })
      ).body;
      accumulatedTracks.push(...currentBatch.items);
    }

    return accumulatedTracks;
  }

  public async getAlbumById(spotify_id: string) {
    const result = await this.SpotifyWebApi.getAlbum(spotify_id);
    return result.body;
  }

  public async getPlaylistById(spotify_id: string) {
    const result = await this.SpotifyWebApi.getPlaylist(spotify_id);
    return result.body;
  }

  public async getTrackById(spotify_id: string) {
    const result = await this.SpotifyWebApi.getTrack(spotify_id);
    return result.body;
  }
}
