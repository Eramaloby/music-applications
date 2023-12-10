import { useContext, useEffect, useState } from 'react';
import './add-item-section.styles.scss';
import { fetchDatabaseStats, postItemToNeo4jCustom } from '../../requests';
import { UserContext } from '../../contexts/user.context';
import AppModal from '../../components/ui-elements/modal';
import AlbumForm from './forms/album-form/album-form.component';
import PlaylistForm from './forms/playlist-form/playlist-form.component';
import ArtistForm from './forms/artist-form/artist-form.component';
import TrackForm from './forms/track-form/track-form.component';
import { Navigate, useNavigate } from 'react-router-dom';
import { DbStats, Neo4jModel } from '../../types';
import GenreForm from './forms/genre-form/genre-form.component';
import { TaskContext } from '../../contexts/task.context';

type AddSection = 'artist' | 'album' | 'genre' | 'playlist' | 'track';

const AddItemPage = () => {
  const { currentUser } = useContext(UserContext);
  const { queueUserTask }= useContext(TaskContext);
  const [modal, setModal] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<AddSection | null>(null);
  const [stats, setStats] = useState<DbStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetchDatabaseStats();
      if (response) {
        setStats({ ...response });
      }
    };

    fetchStats();
  }, []);

  // could add third parameter as reference to related component
  const availableOptions = [
    {
      label: 'I want to add new artist...',
      value: 'artist',
    },
    {
      label: 'I want to add new album...',
      value: 'album',
    },
    {
      label: 'I want to add new genre...',
      value: 'genre',
    },
    {
      label: 'I want to add new playlist...',
      value: 'playlist',
    },
    {
      label: 'I want to add new track...',
      value: 'track',
    },
  ];

  const onSelectOption = (option: { label: string; value: string }) => {
    setCurrentSection(option.value as AddSection);
    setModal(false);
  };

  const navigateBackWrapper = () => {
    setModal(false);
  };

  const handleModal = (value: boolean) => {
    if (!value) {
      navigateBackWrapper();
    } else {
      setModal(true);
    }
  };
  
  const router = useNavigate();

  const onSubmitCallback = async (
    model: Neo4jModel,
    type: 'artist' | 'genre' | 'playlist' | 'track' | 'album'
  ) => {
    if (!currentUser) {
      return;
    }

    queueUserTask(type, model, currentUser.accessToken);
    router('/profile');
  };

  // useEffect(() => {
  //   // TODO: trigger animation to change opacity of modal
  //   setModal(true);
  // }, []);

  if (!currentUser) {
    return <Navigate to="/signin" replace></Navigate>;
  }

  return (
    <>
      <div className="add-item-section-wrapper">
        {currentSection && (
          <>
            {currentSection === 'artist' && (
              <ArtistForm requestCallback={onSubmitCallback}></ArtistForm>
            )}
            {currentSection === 'playlist' && (
              <PlaylistForm requestCallback={onSubmitCallback}></PlaylistForm>
            )}
            {currentSection === 'album' && (
              <AlbumForm requestCallback={onSubmitCallback}></AlbumForm>
            )}
            {currentSection === 'genre' && (
              <GenreForm requestCallback={onSubmitCallback}></GenreForm>
            )}
            {currentSection === 'track' && (
              <TrackForm requestCallback={onSubmitCallback}></TrackForm>
            )}
          </>
        )}
        {/* add spinner to wait for request loading */}
        {!currentSection && (
          <div className="add-item-text-btn">
            <div className="text">
              For logged in users we allow to add items directly to neo4j
              database. We expecting you to be careful when adding new instances
              and relationships.
              <br></br>
              Be careful to not add any duplicates or other harmful data.
              <br></br>
              As for the moment, there are {stats?.nodes} nodes and{' '}
              {stats?.relationships} relationships in database.
            </div>
            <button className="btn" onClick={() => setModal(true)}>
              Add new instance
            </button>
          </div>
        )}
      </div>

      {/*Add animation to change opacity with time */}
      <AppModal visible={modal} setVisible={handleModal} isHiddenOnClick={true}>
        <div className="modal-wrapper">
          <div className="modal-header">Choose instance to create</div>
          <div className="selector-wrapper">
            {availableOptions.map((option, index) => {
              return (
                <div
                  className="clickable-list-option"
                  onClick={() => onSelectOption(option)}
                  key={index}
                >
                  {option.label}
                </div>
              );
            })}
          </div>

          <div className="cancel-btn" onClick={() => navigateBackWrapper()}>
            Cancel
          </div>
        </div>
      </AppModal>
    </>
  );
};

export default AddItemPage;
