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

  relatedGenresIds: number[];
}

export interface TrackModel {
  name: string;
  type: string;
  durationMs: number;
  explicit: boolean;

  image: string;

  authorId: number;
  contributorsIds: number[];
}

export interface AlbumModel {
  name: string;
  type: string;
  countOfTracks: number;
  label: string;
  releaseDate: string;

  image: string;

  relatedGenresIds: number[];
  authorId: number;
  contributorsIds: number[];
  tracksIds: number[];
}

export interface PlaylistModel {
  name: string;
  description: string;

  // could be owner name on spotify, and username inside db
  ownerName: string;

  image: string;

  tracksIds: number[];
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

export interface AlbumProperties {
  image: string;
  added_by: string;
  release_date: string;
  spotify_id: string;
  count_of_tracks: number;
  name: string;
  id: number;
  label: string;
  type: string;
}

export interface GenreProperties {
  image: string;
  added_by: string;
  name: string;
  description: string;
  id: number;
}

export interface ArtistProperties {
  image: string;
  added_by: string;
  spotify_id: string;
  name: string;
  description: string;
  id: number;
  type: string;
}

export interface TrackProperties {
  duration_ms: number;
  explicit: boolean;
  image: string;
  added_by: string;
  spotify_id: string;
  name: string;
  id: number;
  type: string;
}

export interface PlaylistProperties {
  image: string;
  owner_name: string;
  added_by: string;
  spotify_id: string;
  name: string;
  description: string;
  id: number;
}

export interface AlbumWithRelationships {
  properties: AlbumProperties;

  relatedToGenreRelationships: GenreProperties[];
  author: ArtistProperties;
  contributors: ArtistProperties[];
  tracks: TrackProperties[];
}
