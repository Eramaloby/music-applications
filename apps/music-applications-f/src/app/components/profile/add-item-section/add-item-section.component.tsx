import { useContext, useEffect, useState } from 'react';
import './add-item-section.styles.scss';
import { postItemFromParameters } from '../../../requests';
import { UserContext } from '../../../contexts/user.context';
import AppModal from '../../ui-elements/modal';
import GenreForm from '../genre-form/genre-form.component';
import AlbumForm from '../album-form/album-form.component';
import PlaylistForm from '../playlist-form/playlist-form.component';
import ArtistForm from '../artist-form/artist-form.component';
import TrackForm from '../track-form/track-form.component';

type AddSection = 'artist' | 'album' | 'genre' | 'playlist' | 'track';

const AddItemSection = ({ navigateBack }: { navigateBack: () => void }) => {
  const { currentUser } = useContext(UserContext);
  const [modal, setModal] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<AddSection | null>(null);

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
    navigateBack();
  };

  const handleModal = (value: boolean) => {
    if (!value) {
      navigateBackWrapper();
    } else {
      setModal(true);
    }
  }

  useEffect(() => {
    // TODO: trigger animation to change opacity of modal
    setModal(true);
  }, []);

  return (
    <>
      <div className="add-item-section-wrapper">
        {currentSection && (
          <>
            {currentSection === 'artist' && <ArtistForm></ArtistForm>}
            {currentSection === 'playlist' && <PlaylistForm></PlaylistForm>}
            {currentSection === 'album' && <AlbumForm></AlbumForm>}
            {currentSection === 'genre' && <GenreForm></GenreForm>}
            {currentSection === 'track' && <TrackForm></TrackForm>}
          </>
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

export default AddItemSection;
