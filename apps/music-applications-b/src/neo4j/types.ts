export interface GenreModel {
  name: string;
  description: string;

  // in base64 or url provided by spotify
  image: string;
}

export interface ArtistModel {
  name: string;
  description: string;
  type: string;

  image: string;

  relatedGenresIds: string[];
}

export interface TrackModel {
  name: string;
  type: string;
  durationMs: number;
  explicit: boolean;

  image: string;

  authorId: string;
  contributorsIds: string[];
}
export interface AlbumModel {
  name: string;
  type: string;
  countOfTracks: number;
  label: string;
  releaseDate: string;

  image: string;

  relatedGenresIds: string[];
  authorId: string;
  contributorsIds: string[];
  tracksIds: string[];
}

export interface PlaylistModel {
  name: string;
  description: string;

  // could be owner name on spotify, and username inside db
  ownerName: string;

  image: string;

  tracksIds: string[];
  genresIds: string[];
}

export interface TransactionData {
  relationshipCount: number;
  records: { type: string; name: string }[];
}

export interface AddTransactionResult {
  isSuccess: boolean;
  data: TransactionData;
  reason?: string;
}

export interface GenreProperties {
  image: string;
  added_by: string;
  name: string;
  description: string;
  id: string;
  likes: number;
}

export interface ArtistProperties {
  image: string;
  added_by: string;
  spotify_id: string;
  name: string;
  description: string;
  id: string;
  type: string;
  likes: number;
}

export interface TrackProperties {
  duration_ms: number;
  explicit: boolean;
  image: string;
  added_by: string;
  spotify_id: string;
  name: string;
  id: string;
  type: string;
  likes: number;
}

export interface AlbumProperties {
  image: string;
  added_by: string;
  release_date: string;
  spotify_id: string;
  count_of_tracks: number;
  name: string;
  id: string;
  label: string;
  likes: number;
  type: string;
}

export interface PlaylistProperties {
  image: string;
  owner_name: string;
  added_by: string;
  spotify_id: string;
  name: string;
  description: string;
  likes: number;
  id: string;
}
export interface GenreWithRelationships {
  properties: GenreProperties;

  albums: AlbumProperties[];
  artists: ArtistProperties[];
  playlists: PlaylistProperties[];
}

export interface ArtistWithRelationships {
  properties: ArtistProperties;

  tracksAuthor: TrackProperties[];
  albumAuthor: AlbumProperties[];

  tracksContributor: TrackProperties[];
  albumContributor: AlbumProperties[];

  genres: GenreProperties[];
}

export interface TrackWithRelationships {
  properties: TrackProperties;

  author: ArtistProperties;
  contributors: ArtistProperties[];

  album: AlbumProperties;
  playlists: PlaylistProperties[];
}

export interface AlbumWithRelationships {
  properties: AlbumProperties;

  genres: GenreProperties[];
  author: ArtistProperties;
  contributors: ArtistProperties[];
  tracks: TrackProperties[];
}

export interface PlaylistWithRelationships {
  properties: PlaylistProperties;

  tracks: TrackProperties[];
  genres: GenreProperties[];
}

export interface SearchResult {
  type: string;
  label: string;
  spotify_id?: string;
  database_id?: string;
}
