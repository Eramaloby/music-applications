import { SpotifyArtist } from '../../../types';

const ArtistInfo = ({ artist }: { artist: SpotifyArtist }) => {
  return (
    <div className="item-page-content">
      <div className="artist-item-page-details-header">
        <div className="artist-item-page-image">
          {artist.images[1] ? (
            <img
              src={artist.images[1].url}
              height={artist.images[1].height}
              width={artist.images[1].width}
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
          <div className="artist-genres-text">
            <p>{artist.genres.join(' ● ').toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistInfo;
