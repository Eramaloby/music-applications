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
