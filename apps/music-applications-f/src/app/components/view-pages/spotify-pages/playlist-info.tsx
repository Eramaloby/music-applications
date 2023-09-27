import { useNavigate } from 'react-router-dom';
import { PlaylistTrackInfo } from './page-utils';
import { SpotifyPlaylist } from '../../../types';
import { ReactComponent as FilledHeart } from '../../../../assets/filled-heart.svg';
import { ReactComponent as Heart } from '../../../../assets/heart.svg';
import { useContext, useEffect } from 'react';
import { RecentlyViewedContext } from '../../../contexts/recently-viewed.context';

const PlaylistInfo = ({
  playlist,
  isLiked,
  handleLikeChanges,
}: {
  playlist: SpotifyPlaylist;
  isLiked: boolean | null;
  handleLikeChanges: (value: boolean) => void;
}) => {
  const router = useNavigate();
  const trackNameClickCallback = (spotify_id: string) =>
    router(`/web/track/${spotify_id}`);
  const artistNameClickCallback = (spotify_id: string) =>
    router(`/web/artist/${spotify_id}`);

  const { addItem } = useContext(RecentlyViewedContext);
  useEffect(() => {
    addItem({
      spotify_id: playlist.spotify_id,
      type: playlist.type,
      label: playlist.name,
      image: playlist.image ? playlist.image : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="item-page-content">
      <div className="playlist-item-page-details-header">
        <div className="playlist-item-info">
          <div className="playlist-item-page-images">
            <img
              src={playlist.image.url}
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
            {isLiked !== null && (
              <div className="like-container">
                {isLiked !== null && isLiked ? (
                  <FilledHeart
                    className="heart-icon"
                    onClick={() => handleLikeChanges(!isLiked)}
                  ></FilledHeart>
                ) : (
                  <Heart
                    className="heart-icon"
                    onClick={() => handleLikeChanges(!isLiked)}
                  ></Heart>
                )}
              </div>
            )}
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
