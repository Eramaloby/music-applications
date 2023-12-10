/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { TextField, Tooltip } from '@mui/material';
import FileUploader from 'apps/music-applications-f/src/app/components/file-uploader/file-uploader.component';
import AppModal from 'apps/music-applications-f/src/app/components/ui-elements/modal';
import {  Neo4jItemProperties, Neo4jModel, TrackModel } from 'apps/music-applications-f/src/app/types';
import {
  getBase64FromFile,
  validateFieldRequiredNotEmpty,
} from 'apps/music-applications-f/src/app/utils';
import { useState } from 'react';
import { AddRelationPicklist } from '../../add-relation-picklist/add-relation-picklist.component';

export interface TrackFormFields {
  name: string;
  type: string;
  image: string;
  contributors: Neo4jItemProperties[];
  author: Neo4jItemProperties | null;
}

export interface TrackFormFieldsErrors {
  name: string;
  type: string;
  image: string;
  // duration and explicit is not presented
  contributors: string;
  author: string;
}

const TrackForm = ({
  requestCallback,
}: {
  requestCallback: (
    model: Neo4jModel,
    type: 'artist' | 'genre' | 'playlist' | 'track' | 'album'
  ) => void;
}) => {
  const [form, setForm] = useState<TrackFormFields>({
    name: '',
    type: '',
    image: '',
    contributors: [],
    author: null,
  });

  const [errors, setErrors] = useState<TrackFormFieldsErrors>({
    name: '',
    type: '',
    image: '',
    author: '',
    contributors: '',
  });

  const [authorModal, setAuthorModal] = useState(false);
  const [contributorsModal, setContributorsModal] = useState(false);

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
    const value = selectedItems.at(0);
    value && setForm({ ...form, author: value });
    setAuthorModal(false);
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

  const onContributorsSelected = (selectedItems: Neo4jItemProperties[]) => {
    setForm({ ...form, contributors: [...selectedItems] });
    setContributorsModal(false);
  };

  const onSubmit = () => {
    // check for existing errors
    if (Object.values(errors).some((msg) => Boolean(msg))) {
      return;
    }

    const localErrors = {
      name: validateFieldRequiredNotEmpty(form.name, 'Name'),
      type: validateFieldRequiredNotEmpty(form.type, 'Type'),
    };

    if (Object.values(localErrors).some((msg) => Boolean(msg))) {
      setErrors({ ...errors, ...localErrors });
      return;
    }

    if (!form.author) {
      return;
    }

    const model: TrackModel = {
      name: form.name,
      type: form.type,
      durationMs: 10000,
      explicit: false,
      image: form.image,
      authorId: form.author.id,
      contributorsIds: form.contributors.map(i => i.id),
    }

    requestCallback(model, 'track');
  };

  return (
    <div className="form-wrapper">
      <div className="form-header">Fill required track fields</div>
      <div className="form-controls">
        <div className="control-wrapper">
          <Tooltip title="Track name">
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
              label={'Enter track name'}
              value={form.name}
              error={Boolean(errors.name)}
              helperText={errors.name}
              onChange={onFormControlsChange}
            ></TextField>
          </Tooltip>
        </div>
        <div className="control-wrapper">
          <Tooltip title="Track type">
            <TextField
              name="type"
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
              label={'Enter track type'}
              value={form.type}
              error={Boolean(errors.type)}
              helperText={errors.type}
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
            onClick={() => setAuthorModal(true)}
            className="submit-relationships-button"
          >
            Choose author
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
              multipleSelection={true}
              alreadySelectedItemsIds={
                form.author !== null ? [form.author.id] : []
              }
              onSubmitCallback={onAuthorSelected}
            ></AddRelationPicklist>
          </AppModal>
        </div>
        <div className="control-wrapper">
          <button
            onClick={() => setAuthorModal(true)}
            className="submit-relationships-button"
          >
            Choose author
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
              multipleSelection={true}
              alreadySelectedItemsIds={
                form.author !== null ? [form.author.id] : []
              }
              onSubmitCallback={onAuthorSelected}
            ></AddRelationPicklist>
          </AppModal>
        </div>
        <div className="control-wrapper">
          <button
            onClick={() => setAuthorModal(true)}
            className="submit-relationships-button"
          >
            Choose contributors
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
              multipleSelection={true}
              alreadySelectedItemsIds={
                form.author !== null ? [form.author.id] : []
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
      </div>
      <button type="button" className="create-btn" onSubmit={onSubmit}>
        Submit album
      </button>
    </div>
  );
};

export default TrackForm;
