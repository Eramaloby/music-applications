import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TrackInfo from '../../components/view-pages/spotify-pages/track-info';
import AlbumInfo from '../../components/view-pages/spotify-pages/album-info';
import ArtistInfo from '../../components/view-pages/spotify-pages/artist-info';
import PlaylistInfo from '../../components/view-pages/spotify-pages/playlist-info';
import {
  LoadingSpinner,
  PopupMessage,
} from '../../components/view-pages/spotify-pages/page-utils';
import AppModal from '../../components/ui-elements/modal';

import './spotify-content.styles.scss';
import {
  extractSpotifyAlbumProperties,
  extractSpotifyArtistProperties,
  extractSpotifyPlaylistProperties,
  extractSpotifyTrackProperties,
} from '../../utils';
import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyPlaylist,
  SpotifyTrack,
} from '../../types';
import { UserContext } from '../../contexts/user.context';

// todo: refactoring
const SpotifyContentPage = () => {
  const urlToLogin = 'http://localhost:4200/api/login';

  const { currentUser } = useContext(UserContext);

  const router = useNavigate();
  const params = useParams();

  const [item, setItem] = useState<
    SpotifyAlbum | SpotifyArtist | SpotifyPlaylist | SpotifyTrack | undefined
  >(undefined);
  const [error, setError] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const togglePopup = () => setPopup(!popup);

  const recognizeParsingStrategy = (type: string | undefined) => {
    switch (type) {
      case 'track':
        return extractSpotifyTrackProperties;
      case 'artist':
        return extractSpotifyArtistProperties;
      case 'album':
        return extractSpotifyAlbumProperties;
      case 'playlist':
        return extractSpotifyPlaylistProperties;
      default:
        return undefined;
    }
  };

  const parsingStrategy = recognizeParsingStrategy(params['type']);

  const postItem = () => {
    if (item && currentUser) {
      setIsLoading(true);
      axios
        .post(
          `http://localhost:4200/api/add/${params['type']}/${item.spotify_id}`,
          { headers: { Authorization: `Bearer ${currentUser.accessToken}` } }
        )
        .then((response) => {
          setIsLoading(false);
          if (response.data) {
            setPopupMessage('Instance was successfully added!');
          } else {
            setPopupMessage('Instance already added!');
          }

          togglePopup();
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (parsingStrategy) {
      axios
        .get(`http://localhost:4200/api/${params['type']}/${params['id']}`)
        .then(
          (response) => {
            setItem(parsingStrategy(response.data));
          },
          (reason) => {
            if (reason.response.status === 400) {
              setError('Not found!');
            } else {
              setError(
                'Unauthorized access. Before visiting this page you need to acquire or refresh access token.'
              );
            }
          }
        );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params['id'], params['type']]);

  if (error !== '') {
    return (
      <div className="item-error-wrapper">
        <div className="item-error-text">{error}</div>
        <div>
          <p
            className="item-error-link-to-token"
            onClick={() => {
              window.open(urlToLogin, '_blank');
              setInterval(() => window.location.reload(), 300);
            }}
          >
            Acquire token
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="item-page-wrapper">
      <div className="item-page-btns">
        <button
          onClick={() => router(-1)}
          className="go-back-btn"
          disabled={isLoading}
        >
          Back
        </button>
        <button
          className="save-to-db-btn"
          onClick={() => postItem()}
          disabled={isLoading}
          style={{ display: currentUser ? '' : 'none' }}
        >
          Save to db
        </button>
      </div>
      {popup && (
        <PopupMessage
          handleClose={togglePopup}
          message={popupMessage}
        ></PopupMessage>
      )}
      <AppModal
        visible={isLoading}
        setVisible={setIsLoading}
        isHiddenOnClick={true}
      >
        <LoadingSpinner></LoadingSpinner>
      </AppModal>
      {item && (
        <>
          {item.type === 'track' && (
            <TrackInfo track={item as SpotifyTrack}></TrackInfo>
          )}
          {item.type === 'album' && (
            <AlbumInfo album={item as SpotifyAlbum}></AlbumInfo>
          )}
          {item.type === 'playlist' && (
            <PlaylistInfo playlist={item as SpotifyPlaylist}></PlaylistInfo>
          )}
          {item.type === 'artist' && (
            <ArtistInfo artist={item as SpotifyArtist}></ArtistInfo>
          )}
        </>
      )}
    </div>
  );
};

export default SpotifyContentPage;
