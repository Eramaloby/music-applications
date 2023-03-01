import { convertDuration } from '../../../utils';

export const ArtistTrackName = ({
  artist,
  onArtistClickCallback,
}: {
  artist: { label: string; spotify_id: string; type: string };
  onArtistClickCallback: (spotify_id: string) => void;
}) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onArtistClickCallback(artist.spotify_id);
      }}
      className="artist-track-name"
    >
      {artist.label}
    </div>
  );
};

type AlbumTrackInfoProps = {
  track: {
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
  };
  onTrackClickCallback: (spotify_id: string) => void;
  onArtistClickCallback: (spotify_id: string) => void;
};
export const AlbumTrackInfo = ({
  track,
  onTrackClickCallback,
  onArtistClickCallback,
}: AlbumTrackInfoProps) => {
  return (
    <div
      className="album-track-text"
      onClick={(e) => {
        e.stopPropagation();
        onTrackClickCallback(track.spotify_id);
      }}
    >
      <div className="album-track-name">
        {track.track_num}.{' '}
        {track.artists.map((artist, index) => (
          <ArtistTrackName
            onArtistClickCallback={onArtistClickCallback}
            key={index}
            artist={artist}
          ></ArtistTrackName>
        ))}{' '}
        - {track.label}
      </div>
      <div className="album-track-info">
        <div>Duration: {convertDuration(track.duration_ms)}</div>
        <div>Explicit: {track.explicit ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
};

type PlaylistTrackInfoProps = {
  track: {
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
  };
  onTrackClickCallback: (spotify_id: string) => void;
  onArtistClickCallback: (spotify_id: string) => void;
  index: number;
};
export const PlaylistTrackInfo = ({
  track,
  index,
  onTrackClickCallback,
  onArtistClickCallback,
}: PlaylistTrackInfoProps) => {
  return (
    <div
      className="playlist-track-text"
      onClick={(e) => {
        e.stopPropagation();
        onTrackClickCallback(track.spotify_id);
      }}
    >
      <div className="playlist-track-name">
        {index}.{'  '}
        {track.artists.map((artist, index) => (
          <ArtistTrackName
            artist={artist}
            key={index}
            onArtistClickCallback={onArtistClickCallback}
          ></ArtistTrackName>
        ))}{' '}
        - {track.label}
      </div>
      <div className="playlist-track-info">
        <div>Duration: {convertDuration(track.duration_ms)}</div>
        <div>Explicit: {track.explicit ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
};

// extract to utils or ui somewhere
export const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
};

export const PopupMessage = ({
  message,
  handleClose,
}: {
  message: string;
  handleClose: () => void;
}) => {
  setTimeout(() => handleClose(), 3000);
  return (
    <div className="popup-box">
      <div className="popup-message">{message}</div>
    </div>
  );
};
