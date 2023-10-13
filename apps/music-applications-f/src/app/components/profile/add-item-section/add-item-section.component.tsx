import React, { useContext, useEffect, useState } from 'react';
import './add-item-section.styles.scss';
import { postItemFromParameters } from '../../../requests';
import { UserContext } from '../../../contexts/user.context';
import AppModal from '../../ui-elements/modal';
import GenreForm from '../genre-form/genre-form.component';

const AddItemSection = ({ navigateBack }: { navigateBack: () => void }) => {
  const { currentUser } = useContext(UserContext);
  const [modal, setModal] = useState<boolean>(false);

  const [tweak, setTweak] = useState<boolean>(false);

  // could add third parameter as reference to related component
  const availableOptions = [
    { label: 'I want to add new artist...', value: 'artist' },
    { label: 'I want to add new album...', value: 'album' },
    { label: 'I want to add new genre...', value: 'genre' },
    { label: 'I want to add new playlist...', value: 'playlist' },
    { label: 'I want to add new track...', value: 'track' },
  ];

  const onSelectOption = (type: string) => {
    console.log(`choosing an...${type}`);

    if (type === 'genre') {
      setTweak(true);
    }

    setModal(false);
  };

  const navigateBackWrapper = () => {
    setModal(false);
    navigateBack();
  };

  const onPostItem = async () => {
    // validation in progress
    // request

    if (currentUser) {
      await postItemFromParameters(currentUser.accessToken, {
        field: 'value',
        value: 'another value',
      });
    }

    // operation in queue
    // result
  };

  useEffect(() => {
    // TODO: trigger animation to change opacity of modal
    setModal(true);
  }, []);

  return (
    <>
      <div className="add-item-section-wrapper">
        {/*Selector that chooses type of record to add*/}
        {tweak && <GenreForm></GenreForm>}
        <button className="create-instance" onClick={onPostItem}>
          Click to send mock request
        </button>
      </div>

      {/*Add animation to change opacity with time */}
      <AppModal visible={modal} setVisible={setModal} isHiddenOnClick={true}>
        <div className="modal-wrapper">
          <div className="modal-header">Choose instance to create</div>
          <div className="selector-wrapper">
            {availableOptions.map((option, index) => {
              return (
                <div
                  className="clickable-list-option"
                  onClick={() => onSelectOption(option.value)}
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
