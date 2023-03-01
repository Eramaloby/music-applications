import { useNavigate } from 'react-router-dom';
import { PlaylistTrackInfo } from './page-utils';
import { SpotifyPlaylist } from '../../../types';

const PlaylistInfo = ({ playlist }: { playlist: SpotifyPlaylist }) => {
  const router = useNavigate();
  const trackNameClickCallback = (spotify_id: string) =>
    router(`/track/${spotify_id}`);
  const artistNameClickCallback = (spotify_id: string) =>
    router(`/artist/${spotify_id}`);
  return (
    <div className="item-page-content">
      <div className="playlist-item-page-details-header">
        <div className="playlist-item-info">
          <div className="playlist-item-page-images">
            <img
              src={playlist.images[0].url}
              height={400}
              width={400}
              alt="playlist-cover"
            ></img>
            <div className="playlist-owner-text">
              {playlist.owner_name.toUpperCase()}
            </div>
            <div className="playlist-description-text">
              {playlist.description}
            </div>
          </div>
        </div>
        <div className="featured-tracks-wrapper">
          <div className="playlist-name-label">{playlist.name}</div>
          <div className="featured-tracks-label">Featured tracks:</div>
          <div className="featured-tracks">
            {playlist.tracks.map((track, index) => {
              return (
                <PlaylistTrackInfo
                  track={track}
                  key={index}
                  index={index + 1}
                  onTrackClickCallback={trackNameClickCallback}
                  onArtistClickCallback={artistNameClickCallback}
                ></PlaylistTrackInfo>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistInfo;
