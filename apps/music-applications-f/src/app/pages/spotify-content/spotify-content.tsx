import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TrackInfo from '../../components/view-pages/spotify-pages/track-info';
import AlbumInfo from '../../components/view-pages/spotify-pages/album-info';
import ArtistInfo from '../../components/view-pages/spotify-pages/artist-info';
import PlaylistInfo from '../../components/view-pages/spotify-pages/playlist-info';
import toast from 'react-hot-toast';

import './spotify-content.styles.scss';
import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyPlaylist,
  SpotifyTrack,
} from '../../types';
import { UserContext } from '../../contexts/user.context';
import {
  checkIfLikedSpotifyId,
  dropLikeSpotifyId,
  getSpotifyItem,
  isItemInDatabase,
  pressLikeSpotifyId,
} from '../../requests';

// todo: refactoring
const SpotifyContentPage = () => {
  const urlToLogin = 'http://localhost:4200/api/spotify/login';

  const { currentUser } = useContext(UserContext);

  const router = useNavigate();
  const params = useParams();

  const [item, setItem] = useState<
    SpotifyAlbum | SpotifyArtist | SpotifyPlaylist | SpotifyTrack | undefined
  >(undefined);

  // fix save to db button
  const [isSavedToDb, setIsSavedToDb] = useState<boolean>(false);
  const [error] = useState<string>('');

  // update state from server later
  const [isLiked, setIsLiked] = useState<null | boolean>(null);

  const setIsLikedHandler = async (newState: boolean) => {
    if (currentUser && item) {
      if (newState) {
        await pressLikeSpotifyId(item.spotify_id, currentUser.accessToken);
      } else {
        await dropLikeSpotifyId(item.spotify_id, currentUser.accessToken);
      }
      // after awaiting
      setIsLiked(newState);
    }
  };

  // post handler
  const postItem = () => {
    if (item && currentUser) {
      // setIsLoading(true);
      // TODO REFACTORING: Move request from component
      axios
        .post(
          `http://localhost:4200/api/neo4j/${params['type']}/${item.spotify_id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`,
            },
          }
        )
        .then((response) => {
          //setIsLoading(false);
          if (response.data) {
            toast.success('Instance was added to db');
            setIsSavedToDb(true);
          } else {
            toast.success('Instance already in db');
          }

          //togglePopup();
        })
        .catch(() => {
          //setIsLoading(false);
        });
    }
  };

  // check if liked
  useEffect(() => {
    const asyncWrapper = async () => {
      if (currentUser && isSavedToDb && item) {
        if (currentUser && isSavedToDb) {
          const isLiked = await checkIfLikedSpotifyId(
            item.spotify_id,
            currentUser.accessToken
          );
          setIsLiked(isLiked);
        } else {
          setIsLiked(null);
        }
      }
    };

    asyncWrapper();
  }, [currentUser, isSavedToDb, item]);

  // first invoked
  useEffect(() => {
    const asyncWrapper = async () => {
      try {
        const type = params['type'] as string;
        const id = params['id'] as string;
        const data = await getSpotifyItem(type, id);
        if (data) {
          setItem(data);
        }

        const isExists = await isItemInDatabase(id);
        if (isExists !== null) {
          setIsSavedToDb(isExists);
        }
      } catch (error) {
        // add proper error handling
        console.log(error);
      }
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
    /* TODO REFACTORING: REFACTOR BUTTON SAVE AND GO BACK */
    <div className="item-page-wrapper">
      <div className="item-page-btns">
        <button
          onClick={() => router(-1)}
          className="go-back-btn"
          // disabled={isLoading}
        >
          Back
        </button>
        <button
          className="save-to-db-btn"
          onClick={() => postItem()}
          // disabled={isLoading}
          style={{ display: currentUser && !isSavedToDb ? '' : 'none' }}
        >
          Save to db
        </button>
      </div>
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
