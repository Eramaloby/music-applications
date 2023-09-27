import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyPlaylist,
  SpotifyTrack,
} from './spotify-types';

export const extractSpotifyTrackProperties = (
  track: SpotifyApi.SingleTrackResponse
): SpotifyTrack => {
  return {
    type: track.type,
    label: track.name,
    spotify_id: track.id,
    explicit: track.explicit,
    duration_ms: track.duration_ms,
    preview_url: track.preview_url,
    artists: track.artists.map((artist) => {
      return { label: artist.name, spotify_id: artist.id, type: artist.type };
    }),
    album: {
      spotify_id: track.album.id,
      type: track.album.type,
      image: {
        ...track.album.images.at(0),
      },
      label: track.album.name,
      album_type: track.album.album_type,
      release_date: track.album.release_date,
    },
  };
};

export const extractSpotifyArtistProperties = (
  artist: SpotifyApi.SingleArtistResponse
): SpotifyArtist => {
  return {
    type: artist.type,
    label: artist.name,
    spotify_id: artist.id,
    genres: artist.genres,
    image: { ...artist.images.at(0) },
  };
};

export const extractSpotifyAlbumProperties = (
  album: SpotifyApi.SingleAlbumResponse
): SpotifyAlbum => {
  return {
    spotify_id: album.id,
    type: album.type,
    album_type: album.album_type,
    release_date: album.release_date,
    tracks_num: album.total_tracks,
    label: album.name,
    actual_label: album.label,
    image: { ...album.images.at(0) },
    tracks: album.tracks.items.map((track) => {
      return {
        type: track.type,
        label: track.name,
        spotify_id: track.id,
        explicit: track.explicit,
        duration_ms: track.duration_ms,
        track_num: track.track_number,
        artists: track.artists.map((artist) => {
          return {
            label: artist.name,
            spotify_id: artist.id,
            type: artist.type,
          };
        }),
      };
    }),
    artists: album.artists.map((artist) => {
      return {
        label: artist.name,
        spotify_id: artist.id,
        type: artist.type,
      };
    }),
  };
};

export const extractSpotifyPlaylistProperties = (
  playlist: SpotifyApi.SinglePlaylistResponse
): SpotifyPlaylist => {
  return {
    spotify_id: playlist.id,
    description: playlist.description,
    owner_name: playlist.owner.display_name,
    image: { ...playlist.images.at(0) },
    name: playlist.name,
    collaborative: playlist.collaborative,
    type: playlist.type,
    tracks_num: playlist.tracks.total,
    tracks: playlist.tracks.items.slice(0, -1).map((value) => {
      return {
        type: value['track'].type,
        label: value['track'].name,
        spotify_id: value['track'].id,
        explicit: value['track'].explicit,
        duration_ms: value['track'].duration_ms,
        track_num: value['track'].track_number,
        artists: value['track'].artists.map((artist) => {
          return {
            label: artist.name,
            spotify_id: artist.id,
            type: artist.type,
          };
        }),
        album: {
          spotify_id: value['track'].album.id,
          type: value['track'].album.type,
          label: value['track'].album.name,
          album_type: value['track'].album.album_type,
        },
      };
    }),
  };
};
