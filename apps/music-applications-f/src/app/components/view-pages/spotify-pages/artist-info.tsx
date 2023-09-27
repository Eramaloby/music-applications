import { SpotifyArtist } from '../../../types';
import { ReactComponent as FilledHeart } from '../../../../assets/filled-heart.svg';
import { ReactComponent as Heart } from '../../../../assets/heart.svg';
import { useContext, useEffect } from 'react';
import { RecentlyViewedContext } from '../../../contexts/recently-viewed.context';

const ArtistInfo = ({
  artist,
  isLiked,
  handleLikeChanges,
}: {
  artist: SpotifyArtist;
  isLiked: boolean | null;
  handleLikeChanges: (value: boolean) => void;
}) => {
  const { addItem } = useContext(RecentlyViewedContext);
  useEffect(() => {
    addItem({
      spotify_id: artist.spotify_id,
      type: artist.type,
      label: artist.label,
      image: artist.image ? artist.image : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="item-page-content">
      <div className="artist-item-page-details-header">
        <div className="artist-item-page-image">
          {artist.image ? (
            <img
              src={artist.image.url}
              height={artist.image.height}
              width={artist.image.width}
              alt="artist-cover"
            ></img>
          ) : (
            <div></div>
          )}
        </div>
        <div className="artist-item-page-title">
          <div className="artist-type-text">
            <p>{artist.type.toUpperCase()}</p>
          </div>
          <div className="artist-label-text">
            <p>{artist.label}</p>
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
          <div className="artist-genres-text">
            <p>{artist.genres.join(' ● ').toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistInfo;
