export interface DropdownItem {
  type: string;
  label: string;
  spotify_id?: string;
}

export interface Neo4jDbItem {
  type: string;
  properties:
    | TrackProperties
    | ArtistProperties
    | GenreProperties
    | AlbumProperties
    | PlaylistProperties;
  relations: {
    type: string;
    target: {
      type: string;
      properties:
        | TrackProperties
        | ArtistProperties
        | GenreProperties
        | AlbumProperties
        | PlaylistProperties;
    };
  }[];
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
export interface TrackProperties {
  duration_ms: string;
  explicit: boolean;
  name: string;
  spotify_id: string;
}

export interface ArtistProperties {
  name: string;
  spotify_id: string;
  type: string;
}

export interface GenreProperties {
  name: string;
}

export interface AlbumProperties {
  count_of_tracks: number;
  label: string;
  name: string;
  release: string;
  spotify_id: string;
  type: string;
}

export interface PlaylistProperties {
  collaborative: boolean;
  description: string;
  name: string;
  owner_name: string;
  spotify_id: string;
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

export interface User {
  email: string;
  username: string;
  accessToken: string;

  // add image and other later
}
