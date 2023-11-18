/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import React, { useState } from 'react';
import '../../common.styles.scss';
import { Neo4jItemProperties } from 'apps/music-applications-f/src/app/types';
import { TextField, Tooltip } from '@mui/material';
import FileUploader from 'apps/music-applications-f/src/app/components/file-uploader/file-uploader.component';
import { getBase64FromFile } from 'apps/music-applications-f/src/app/utils';
import AppModal from 'apps/music-applications-f/src/app/components/ui-elements/modal';
import { AddRelationPicklist } from '../../add-relation-picklist/add-relation-picklist.component';

export interface AlbumFormFields {
  name: string;
  type: string;
  countOfTracks: number;
  label: string;
  releaseDate: string;

  image: string;

  relatedGenres: Neo4jItemProperties[];
  author: Neo4jItemProperties | null;
  contributors: Neo4jItemProperties[];
  tracks: Neo4jItemProperties[];
}

export interface AlbumFormErrors {
  name: string;
  type: string;
  countOfTracks: string;
  label: string;
  releaseDate: string;

  image: string;

  relatedGenres: string;
  author: string;
  contributors: string;
  tracks: string;
}

const AlbumForm = () => {
  const [form, setForm] = useState<AlbumFormFields>({
    name: '',
    type: '',
    countOfTracks: 0,
    label: '',
    releaseDate: '',
    image: '',
    contributors: [],
    tracks: [],
    author: null,
    relatedGenres: [],
  });

  const [errors, setErrors] = useState<AlbumFormErrors>({
    name: '',
    type: '',
    countOfTracks: '',
    label: '',
    releaseDate: '',
    image: '',
    relatedGenres: '',
    author: '',
    contributors: '',
    tracks: '',
  });

  const [contributorsModal, setContributorsModal] = useState(false);
  const [tracksModal, setTracksModal] = useState(false);
  const [authorModal, setAuthorModal] = useState(false);
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

  const onAuthorSelected = (selectedItems: Neo4jItemProperties[]) => {
    setForm({ ...form, author: selectedItems.at(0)! });
    setAuthorModal(false);
  };

  const onContributorsSelected = (selectedItems: Neo4jItemProperties[]) => {
    setForm({ ...form, contributors: [...selectedItems] });
    setContributorsModal(false);
  };

  const onTracksSelected = (selectedItems: Neo4jItemProperties[]) => {
    setForm({ ...form, tracks: [...selectedItems] });
    setTracksModal(false);
  };

  const onGenresSelected = (selectedItems: Neo4jItemProperties[]) => {
    setForm({ ...form, relatedGenres: [...selectedItems] });
    setGenresModal(false);
  };

  return (
    <div className="form-wrapper">
      <div className="form-header">Fill fields for album objects</div>
      <div className="form-controls">
        <div className="control-wrapper">
          <Tooltip title="Album name">
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
              label={'Enter album name'}
              value={form.name}
              error={Boolean(errors.name)}
              helperText={errors.name}
            ></TextField>
          </Tooltip>
        </div>
        <div className="control-wrapper">
          <Tooltip title="Album type, like single, special or any other...">
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
              label={'Enter album type'}
              value={form.type}
              error={Boolean(errors.type)}
              helperText={errors.type}
            ></TextField>
          </Tooltip>
        </div>
        <div className="control-wrapper">
          <Tooltip title="Count of tracks on album">
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
              label={'Enter count of tracks on album'}
              value={form.countOfTracks}
              error={Boolean(errors.countOfTracks)}
              helperText={errors.countOfTracks}
              type="number"
            ></TextField>
          </Tooltip>
        </div>
        <div className="control-wrapper">
          <Tooltip title="Enter album label or legal owner of rights...">
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
              label={'Enter album label'}
              value={form.label}
              error={Boolean(errors.label)}
              helperText={errors.label}
            ></TextField>
          </Tooltip>
        </div>
        <div className="control-wrapper">
          <Tooltip title="Enter release date">
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
              label={'Enter album release date'}
              value={form.releaseDate}
              error={Boolean(errors.releaseDate)}
              helperText={errors.releaseDate}
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
            onClick={() => setAuthorModal(true)}
            className="submit-relationships-button"
          >
            Add album author
          </button>
          <AppModal
            visible={authorModal}
            setVisible={setAuthorModal}
            isHiddenOnClick={false}
          >
            <AddRelationPicklist
              allowEmpty={false}
              type="artist"
              relationshipTypeLabel="Author"
              multipleSelection={false}
              alreadySelectedItemsIds={
                form.author != null ? [form.author.id] : []
              }
              onSubmitCallback={onAuthorSelected}
            ></AddRelationPicklist>
          </AppModal>
        </div>
        <div className="control-wrapper">
          <button
            onClick={() => setContributorsModal(true)}
            className="submit-relationships-button"
          >
            Add contributors
          </button>
          <AppModal
            visible={contributorsModal}
            setVisible={setContributorsModal}
            isHiddenOnClick={false}
          >
            <AddRelationPicklist
              allowEmpty={true}
              type="artist"
              relationshipTypeLabel="AppearedAt"
              multipleSelection={true}
              onSubmitCallback={onContributorsSelected}
              alreadySelectedItemsIds={form.contributors.map((i) => i.id)}
            ></AddRelationPicklist>
          </AppModal>
        </div>
        <div className="control-wrapper">
          <button
            className="submit-relationships-button"
            onClick={() => setTracksModal(true)}
          >
            Add tracks
          </button>
          <AppModal
            visible={tracksModal}
            setVisible={setTracksModal}
            isHiddenOnClick={false}
          >
            <AddRelationPicklist
              allowEmpty={false}
              type="track"
              relationshipTypeLabel="Tracks"
              multipleSelection={true}
              onSubmitCallback={onTracksSelected}
              alreadySelectedItemsIds={form.tracks.map((i) => i.id)}
            ></AddRelationPicklist>
          </AppModal>
        </div>
        <div className="control-wrapper">
          <button
            className="submit-relationships-button"
            onClick={() => setGenresModal(true)}
          >
            Add genres
          </button>
          <AppModal
            visible={genresModal}
            setVisible={setGenresModal}
            isHiddenOnClick={false}
          >
            <AddRelationPicklist
              allowEmpty={true}
              type="genre"
              relationshipTypeLabel='Genres'
              multipleSelection={true}
              onSubmitCallback={onGenresSelected}
              alreadySelectedItemsIds={form.relatedGenres.map((i) => i.id)}
            ></AddRelationPicklist>
          </AppModal>
        </div>
      </div>
      <button type='button' className='create-btn'>Submit album</button>
    </div>
  );
};

export default AlbumForm;
