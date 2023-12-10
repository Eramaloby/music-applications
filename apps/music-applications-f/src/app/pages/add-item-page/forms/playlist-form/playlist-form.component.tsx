/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import React, { useState } from 'react';
import '../../common.styles.scss';
import {
  getBase64FromFile,
  validateFieldRequiredNotEmpty,
} from 'apps/music-applications-f/src/app/utils';
import { Neo4jItemProperties } from 'apps/music-applications-f/src/app/types';
import { TextField, Tooltip } from '@mui/material';
import FileUploader from 'apps/music-applications-f/src/app/components/file-uploader/file-uploader.component';
import AppModal from 'apps/music-applications-f/src/app/components/ui-elements/modal';
import { AddRelationPicklist } from '../../add-relation-picklist/add-relation-picklist.component';

export interface PlaylistFormFields {
  name: string;
  description: string;
  ownerName: string;
  image: string;
  tracks: Neo4jItemProperties[];
  genres: Neo4jItemProperties[];
}

export interface PlaylistFormFieldsErrors {
  name: string;
  description: string;
  ownerName: string;
  image: string;
  tracks: string;
  genres: string;
}

const PlaylistForm = () => {
  const [form, setForm] = useState<PlaylistFormFields>({
    name: '',
    description: '',
    ownerName: '',
    image: '',
    tracks: [],
    genres: [],
  });

  const [errors, setErrors] = useState<PlaylistFormFieldsErrors>({
    name: '',
    description: '',
    ownerName: '',
    image: '',
    tracks: '',
    genres: '',
  });

  const [tracksModal, setTracksModal] = useState(false);
  const [genresModal, setGenresModal] = useState(false);

  const onImageLoaded = async (file: File) => {
    if (!file.type.includes('image')) {
      setErrors({
        ...errors,
        image: 'File is required to be an image.',
      });

      return;
    } else {
      const imageHash = (await getBase64FromFile(file)) as string;
      setForm({ ...form, image: imageHash });
      setErrors({ ...errors, image: '' });
    }
  };

  const onFormControlsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });

    // introduce type that maps names and labels?
    setErrors({
      ...errors,
      [event.target.name]: validateFieldRequiredNotEmpty(
        event.target.value,
        event.target.name
      ),
    });
  };

  const onSubmit = () => {
    // check for existing errors
    if (Object.values(errors).some((msg) => Boolean(msg))) {
      return;
    }

    const localErrors = {
      name: validateFieldRequiredNotEmpty(form.name, 'Name'),
      description: validateFieldRequiredNotEmpty(
        form.description,
        'Description'
      ),
      ownerName: validateFieldRequiredNotEmpty(form.ownerName, 'Image'),
    };

    if (Object.values(localErrors).some((msg) => Boolean(msg))) {
      setErrors({ ...errors, ...localErrors });
      return;
    }

    console.log(form);


    // validation passed
    // invoke callback
  };

  const onTracksSelected = (selectedItems: Neo4jItemProperties[]) => {
    setForm({ ...form, tracks: selectedItems });
    setTracksModal(false);
  };

  const onGenresSelected = (selectedItems: Neo4jItemProperties[]) => {
    setForm({ ...form, genres: selectedItems });
    setTracksModal(false);
  };

  return (
    <div className="form-wrapper">
      <div className="form-header">Fill required playlist fields</div>
      <div className="form-controls">
        <div className="control-wrapper">
          <Tooltip title="playlist name">
            <TextField
              name="name"
              className="form-value-input"
              InputLabelProps={{ style: { color: 'white', fontWeight: '500' } }}
              inputProps={{
                style: {
                  color: 'white',
                  fontWeight: '400',
                  height: '15px',
                },
              }}
              color={'primary'}
              label="Enter playlist name"
              value={form.name}
              error={Boolean(errors.name)}
              helperText={errors.name}
              onChange={onFormControlsChange}
            ></TextField>
          </Tooltip>
        </div>
        <div className="control-wrapper">
          <Tooltip title="playlist description">
            <TextField
              name="description"
              className="form-value-input"
              InputLabelProps={{ style: { color: 'white', fontWeight: '500' } }}
              inputProps={{
                style: {
                  color: 'white',
                  fontWeight: '400',
                  height: '15px',
                },
              }}
              color={'primary'}
              label="Enter playlist description"
              value={form.description}
              error={Boolean(errors.description)}
              helperText={errors.description}
              onChange={onFormControlsChange}
            ></TextField>
          </Tooltip>
        </div>
        <div className="control-wrapper">
          <Tooltip title="Either playlist owner name, or username">
            <TextField
              name="ownerName"
              className="form-value-input"
              InputLabelProps={{ style: { color: 'white', fontWeight: '500' } }}
              inputProps={{
                style: {
                  color: 'white',
                  fontWeight: '400',
                  height: '15px',
                },
              }}
              color={'primary'}
              label="Enter owner name"
              value={form.ownerName}
              error={Boolean(errors.ownerName)}
              helperText={errors.ownerName}
              onChange={onFormControlsChange}
            ></TextField>
          </Tooltip>
        </div>
        <div className="control-wrapper">
          <div>
            <FileUploader
              handleFile={onImageLoaded}
              buttonText="Upload album image"
              showFileName={true}
            ></FileUploader>
          </div>

          {form.image !== '' && errors.image === '' && (
            <div className="image-preview">
              <img src={form.image} alt=""></img>
            </div>
          )}

          {errors.image && (
            <div className="image-validation-message">{errors.image}</div>
          )}
        </div>
        <div className="control-wrapper">
          <button
            onClick={() => setGenresModal(true)}
            className="submit-relationships-button"
          >
            Add playlist genres
          </button>
          <AppModal
            visible={genresModal}
            setVisible={setGenresModal}
            isHiddenOnClick={false}
          >
            <AddRelationPicklist
              allowEmpty={true}
              type="genre"
              relationshipTypeLabel="Genres"
              multipleSelection={true}
              alreadySelectedItemsIds={form.genres.map((i) => i.id)}
              onSubmitCallback={onGenresSelected}
            ></AddRelationPicklist>
          </AppModal>
        </div>
        <div className="control-wrapper">
          <button
            onClick={() => setTracksModal(true)}
            className="submit-relationships-button"
          >
            Add playlist tracks
          </button>
          <AppModal
            visible={tracksModal}
            setVisible={setTracksModal}
            isHiddenOnClick={false}
          >
            <AddRelationPicklist
              allowEmpty={true}
              type="track"
              relationshipTypeLabel="Tracks"
              multipleSelection={true}
              alreadySelectedItemsIds={form.tracks.map((i) => i.id)}
              onSubmitCallback={onTracksSelected}
            ></AddRelationPicklist>
          </AppModal>
        </div>
      </div>
      <button type="button" className="create-btn" onClick={onSubmit}>
        Submit playlist
      </button>
    </div>
  );
};

export default PlaylistForm;
