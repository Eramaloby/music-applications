export interface DropdownItem {
  type: string;
  label: string;
  spotify_id?: string;
  database_id?: number;
}

export interface SpotifyArtist {
  type: string;
  label: string;
  spotify_id: string;
  genres: string[];
  image: { height?: number; url: string; width?: number };
}

export interface SpotifyTrack {
  type: string;
  spotify_id: string;
  preview_url: string | undefined;
  label: string;
  explicit: boolean;
  duration_ms: number;
  artists: {
    label: string;
    spotify_id: string;
    type: string;
  }[];
  album: {
    release_date: string;
    label: string;
    image: { height?: number; url: string; width?: number };
    spotify_id: string;
    album_type: string;
    type: string;
  };
}

export interface SpotifyAlbum {
  spotify_id: string;
  type: string;
  album_type: string;
  release_date: string;
  tracks_num: number;
  label: string;
  actual_label: string;
  image: { height?: number; url: string; width?: number };
  tracks: {
    type: string;
    label: string;
    spotify_id: string;
    explicit: boolean;
    duration_ms: number;
    track_num: number;
    artists: {
      label: string;
      spotify_id: string;
      type: string;
    }[];
  }[];
  artists: {
    label: string;
    spotify_id: string;
    type: string;
  }[];
}

export interface SpotifyPlaylist {
  spotify_id: string;
  description: string;
  owner_name: string;
  image: { height?: number; url: string; width?: number };
  name: string;
  collaborative: boolean;
  type: string;
  tracks_num: number;
  tracks: {
    type: string;
    label: string;
    spotify_id: string;
    explicit: boolean;
    duration_ms: number;
    track_num: number;
    artists: {
      label: string;
      spotify_id: string;
      type: string;
    }[];
    album: {
      spotify_id: string;
      type: string;
      label: string;
      album_type: string;
    };
  }[];
}

/* Db related interfaces */
export interface GenreProperties {
  image: string;
  added_by: string;
  name: string;
  description: string;
  likes: { low: number };
  id: string;
}

export interface ArtistProperties {
  image: string;
  added_by: string;
  spotify_id: string;
  name: string;
  description: string;
  id: string;
  likes: { low: number };
  type: string;
}

export interface TrackProperties {
  duration_ms: number;
  explicit: boolean;
  image: string;
  added_by: string;
  spotify_id: string;
  name: string;
  id: string;
  likes: { low: number };
  type: string;
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
  likes: { low: number };
  type: string;
}

export interface PlaylistProperties {
  image: string;
  owner_name: string;
  added_by: string;
  spotify_id: string;
  name: string;
  description: string;
  likes: { low: number };
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

export type Neo4jItemProperties =
  | GenreProperties
  | AlbumProperties
  | TrackProperties
  | PlaylistProperties
  | ArtistProperties;

export type Neo4jNodeWithRelationships =
  | PlaylistWithRelationships
  | AlbumWithRelationships
  | TrackWithRelationships
  | ArtistWithRelationships
  | GenreWithRelationships;

export interface FetchItemFromNeo4jResult {
  item: Neo4jNodeWithRelationships;
  type: string;
}

// form interfaces
export interface UserSignUpForm {
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  username: string;
  dateOfBirth: Date | null;
  gender: string;
}

export interface UserSignUpFormErrors {
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  username: string;
}

export interface UserSignUpRequestResult {
  isSuccessful: boolean;
  message: string;
}

// sign in page abstractions
export interface UserSignInForm {
  username: string;
  password: string;
}

export interface UserSignInFormErrors {
  username: string;
  password: string;
  errorMessage: string;
}

export interface UserSignInRequestResult {
  token: string | undefined;
  isSuccessful: boolean;
  reason: string | undefined;
}

// change password abstractions
export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordFormErrors {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// user abstractions
export interface User {
  email: string;
  username: string;
  accessToken: string;
  password: string;
  dateOfBirth: string;
  gender: string;
  id: string;
  profileImageBase64: string;

  // add image and other later
}

// export enum ProfilePageStates {
//   RESET_PASSWORD = 'reset',
//   SEARCH_SAVED_ITEMS = 'saved',
//   LIKED_ITEMS = 'favorite',
//   DEFAULT = 'default',
//   ADD_NEW_ITEM = 'add',
// }

export interface ItemPreview {
  databaseId?: string;
  spotify_id?: string;
  image?: { height?: number; url: string; width?: number };
  label: string;
  type: string;
}

export interface DbStats {
  nodes: number;
  relationships: number;
}

export interface LyricsNeuralNetworkParams {
  author: string;
  first_line: string;
  length: number;
  freedom_index: number;
  stop_words: string[];
  isExplicit: boolean;
}
