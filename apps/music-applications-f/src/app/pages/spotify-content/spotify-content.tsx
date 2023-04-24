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

  const [isSavedToDb, setIsSavedToDb] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // update state from server later
  const [isLiked, setIsLiked] = useState<null | boolean>(null);

  const setIsLikedHandler = async (newState: boolean) => {
    if (newState) {
      const response = await axios.post(
        `http://localhost:4200/api/like`,
        { spotify_id: item?.spotify_id },
        {
          headers: {
            Authorization: `Bearer ${currentUser!.accessToken}`,
          },
        }
      );
    } else {
      const response = await axios.delete(`http://localhost:4200/api/like`, {
        headers: {
          Authorization: `Bearer ${currentUser!.accessToken}`,
        },
        params: { spotify_id: item!.spotify_id },
      });
    }

    // after awaiting
    setIsLiked(newState);
  };

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
      console.log(currentUser.accessToken);
      setIsLoading(true);
      axios
        .post(
          `http://localhost:4200/api/add/${params['type']}/${item.spotify_id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`,
            },
          }
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
    const asyncWrapee = async () => {
      if (currentUser && isSavedToDb && item) {
        if (currentUser && isSavedToDb) {
          const result = await axios.get(
            `http://localhost:4200/api/like?spotifyId=${item.spotify_id}`,
            {
              headers: {
                Authorization: `Bearer ${currentUser.accessToken}`,
              },
            }
          );

          if (result.data) {
            setIsLiked(true);
          } else {
            setIsLiked(false);
          }
        } else {
          setIsLiked(null);
        }
      }
    };

    asyncWrapee();
  }, [currentUser, isSavedToDb, item]);

  useEffect(() => {
    const asyncWrapper = async () => {
      if (parsingStrategy) {
        try {
          const response = await axios.get(
            `http://localhost:4200/api/item/${params['type']}/${params['id']}`
          );
          setItem(parsingStrategy(response.data));

          const existResponse = await axios.get(
            `http://localhost:4200/api/exists/${params['id']}`
          );

          if (existResponse.data) {
            setIsSavedToDb(true);
          }
        } catch (error) {
          console.log(error);
        }
      }
      // .then(
      //   (response) => {
      //     setItem(parsingStrategy(response.data));
      //     // check state of item whether it's added or not
      //   },
      //   (reason) => {
      //     if (reason.response.status === 400) {
      //       setError('Not found!');
      //     } else {
      //       setError(
      //         'Unauthorized access. Before visiting this page you need to acquire or refresh access token.'
      //       );
      //     }
      //   }
      // );
    };

    asyncWrapper();

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
              // setInterval(() => window.location.reload(), 300);
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
          style={{ display: currentUser && !isSavedToDb ? '' : 'none' }}
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
            <TrackInfo
              track={item as SpotifyTrack}
              isLiked={isLiked}
              handleLikeChanges={setIsLikedHandler}
            ></TrackInfo>
          )}
          {item.type === 'album' && (
            <AlbumInfo
              album={item as SpotifyAlbum}
              isLiked={isLiked}
              handleLikeChanges={setIsLikedHandler}
            ></AlbumInfo>
          )}
          {item.type === 'playlist' && (
            <PlaylistInfo
              playlist={item as SpotifyPlaylist}
              isLiked={isLiked}
              handleLikeChanges={setIsLikedHandler}
            ></PlaylistInfo>
          )}
          {item.type === 'artist' && (
            <ArtistInfo
              artist={item as SpotifyArtist}
              isLiked={isLiked}
              handleLikeChanges={setIsLikedHandler}
            ></ArtistInfo>
          )}
        </>
      )}
    </div>
  );
};

export default SpotifyContentPage;
