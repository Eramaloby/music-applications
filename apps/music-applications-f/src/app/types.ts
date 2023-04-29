export interface DropdownItem {
  type: string;
  label: string;
  spotify_id?: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyArtist {
  type: string;
  label: string;
  spotify_id: string;
  preview_url: string | undefined;
  genres: string[];
  images: Image[];
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
    images: Image[];
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
  images: Image[];
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
  images: Image[];
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
export interface Neo4jDbItem {
  type: string;
  name: string;
  properties:
    | TrackProperties
    | ArtistProperties
    | GenreProperties
    | AlbumProperties
    | PlaylistProperties;
  relations: {
    type: string;
    target: Neo4jDbItem;
  }[];
}

export interface TrackProperties {
  id: number;
  name: string;
  duration_ms: string;
  explicit: boolean;
  spotify_id: string;
  added_by: string;
}

export interface ArtistProperties {
  id: number;
  name: string;
  spotify_id: string;
  type: string;
  added_by: string;
}

export interface GenreProperties {
  id: number;
  added_by: string;
  name: string;
}

export interface AlbumProperties {
  id: number;
  name: string;
  count_of_tracks: number;
  label: string;
  release: string;
  spotify_id: string;
  type: string;
  added_by: string;
}

export interface PlaylistProperties {
  id: number;
  collaborative: boolean;
  description: string;
  name: string;
  owner_name: string;
  spotify_id: string;
  added_by: string;
}

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

export interface UserSignInForm {
  username: string;
  password: string;
}

export interface UserSignInFormErrors {
  username: string;
  password: string;
}

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

export interface User {
  email: string;
  username: string;
  accessToken: string;
  password: string;
  dateOfBirth: string;
  gender: string;
  id: string;

  // add image and other later
}

export enum ProfilePageStates {
  RESET_PASSWORD = 'reset',
  SEARCH_SAVED_ITEMS = 'saved',
  LIKED_ITEMS = 'favorite',
  DEFAULT = 'default',
}

export interface RecentlyViewedItem {
  image: Image;
  label: string;
  type: string;
}

export interface ProfilePageSavedStats {
  nodes: number;
  relationships: number;
}
