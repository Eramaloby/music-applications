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
  nodesCount: number;

  records: { type: string; name: string }[];
}

export interface AddTransactionResult {
  isSuccess: boolean;
  data: TransactionData;
  reason?: string;
}
