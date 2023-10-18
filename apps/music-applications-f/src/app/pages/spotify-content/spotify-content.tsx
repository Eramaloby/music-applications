import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TrackInfo from '../../components/view-pages/spotify-pages/track-info';
import AlbumInfo from '../../components/view-pages/spotify-pages/album-info';
import ArtistInfo from '../../components/view-pages/spotify-pages/artist-info';
import PlaylistInfo from '../../components/view-pages/spotify-pages/playlist-info';
import { toast } from 'react-toastify';

import './spotify-content.styles.scss';
import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyPlaylist,
  SpotifyTrack,
} from '../../types';
import {
  AsyncNeo4jTaskMetadata,
  UserContext,
} from '../../contexts/user.context';
import {
  checkIfLikedSpotifyId,
  dropLikeSpotifyId,
  getSpotifyItem,
  isItemInDatabase,
  postItemToNeo4j,
  pressLikeSpotifyId,
} from '../../requests';

// todo: refactoring
const SpotifyContentPage = () => {
  const urlToLogin = 'http://localhost:4200/api/spotify/login';

  const { currentUser, addTask } = useContext(UserContext);

  const router = useNavigate();
  const params = useParams();

  const [item, setItem] = useState<
    SpotifyAlbum | SpotifyArtist | SpotifyPlaylist | SpotifyTrack | undefined
  >(undefined);

  // fix save to db button
  const [isSavedToDb, setIsSavedToDb] = useState<boolean>(false);
  const [isAddAvailable, setIsAddAvailable] = useState<boolean>(false);

  // TODO: fix error on token declining
  const [error, setError] = useState<string>('');

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
  const postItem = async () => {
    if (item && currentUser) {
      setIsAddAvailable(false);

      toast.info('In progress... \nCheck profile page to track operation.', {
        position: 'top-center',
        icon: '😋',
      });

      const task: AsyncNeo4jTaskMetadata = {
        startedAt: Date.now(),
        finished: false,
        failed: false,
        details: [],
        relsCount: 0,
      };

      addTask(task);

      postItemToNeo4j(item.type, item.spotify_id, currentUser.accessToken).then(
        (response) => {
          if (response.isSuccess) {
            task.finished = true;
            task.details = [...response.records];
            toast.success('Instance was added to database.', {
              position: 'top-center',
            });
            task.relsCount = response.relsCount;
          } else {
            task.failed = true;
            toast.error('Failed in execution', {
              position: 'top-center',
            });
          }

          task.finishedIn = (Date.now() - task.startedAt) / 1000;
        }
      );
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
      const type = params['type'] as string;
      const id = params['id'] as string;
      const data = await getSpotifyItem(type, id);
      if (data.statusCode === 200) {
        setItem(data.item);
        const isExists = await isItemInDatabase(id);
        if (isExists !== null) {
          setIsSavedToDb(isExists);
          setIsAddAvailable(true);
        }
      } else if (data.statusCode === 401) {
        setError('No spotify token provide. Click on text to receive one.');
      } else {
        setError('Unknown error. Never open this resource again...');
      }
    };

    asyncWrapper();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params['id'], params['type']]);

  if (error !== '') {
    return (
      <div className="item-error-wrapper">
        <div>
          <p
            className="item-error-link-to-token"
            onClick={() => {
              window.open(urlToLogin, '_blank');
              setInterval(() => window.location.reload(), 300);
            }}
          >
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    /* TODO REFACTORING: REFACTOR BUTTON SAVE AND GO BACK */
    <div className="item-page-wrapper">
      <div className="item-page-btns">
        <button onClick={() => router(-1)} className="go-back-btn">
          Back
        </button>
        {isAddAvailable && !isSavedToDb && currentUser && (
          <button className="save-to-db-btn" onClick={() => postItem()}>
            Save to db
          </button>
        )}
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
