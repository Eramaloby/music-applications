import { TextField, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { getBase64FromFile, validateFieldRequiredNotEmpty } from '../../../../utils';
import AppModal from '../../../../components/ui-elements/modal';
import { AddRelationPicklist } from '../../add-relation-picklist/add-relation-picklist.component';
import { Neo4jItemProperties } from '../../../../types';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import FileUploader from 'apps/music-applications-f/src/app/components/file-uploader/file-uploader.component';
import '../../common.styles.scss';

export interface ArtistFormFields {
  name: string;
  type: string;
  description: string;
  image: string;

  genres: Neo4jItemProperties[];
}

export interface ArtistFormFieldsErrors {
  name: string;
  type: string;
  description: string;
  image: string;
  genres: string;
}

const ArtistForm = () => {
  const [form, setForm] = useState<ArtistFormFields>({
    name: '',
    type: '',
    description: '',
    image: '',
    genres: [],
  });

  const [errors, setErrors] = useState<ArtistFormFieldsErrors>({
    name: '',
    type: '',
    description: '',
    image: '',
    genres: '',
  });

  const [modal, setModal] = useState(false);

  const onSelectedItemsSubmit = (selectedItems: Neo4jItemProperties[]) => {
    setForm({ ...form, genres: [...selectedItems] });
    setModal(false);
  };

  const onArtistFileSelected = async (file: File) => {
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

    setErrors({
      ...errors,
      [event.target.name]: validateFieldRequiredNotEmpty(
        event.target.value,
        event.target.name
      ),
    });
  };

  return (
    <div className="form-wrapper">
      <div className="form-header">Fill required artist fields</div>
      <div className="form-controls">
        <div className="control-wrapper">
          <Tooltip
            title="Artist name, real person name, band or group name"
            placement="top"
          >
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
              label={'Enter artist name'}
              value={form.name}
              onChange={onFormControlsChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
            ></TextField>
          </Tooltip>
        </div>
        <div className="control-wrapper">
          <Tooltip
            title="Could be singer, band, guitarist, etc"
            placement="top"
          >
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
              label={'Enter artist type'}
              value={form.type}
              onChange={onFormControlsChange}
              error={Boolean(errors.type)}
              helperText={errors.type}
            ></TextField>
          </Tooltip>
        </div>
        <div className="control-wrapper">
          <Tooltip
            title="Something that would describe an artist or short biography"
            placement="top"
          >
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
              label={'Enter artist description'}
              value={form.description}
              onChange={onFormControlsChange}
              error={Boolean(errors.description)}
              helperText={errors.description}
            ></TextField>
          </Tooltip>
        </div>
        <div className="control-wrapper">
          <div>
            <FileUploader
              handleFile={onArtistFileSelected}
              buttonText="Upload artist image"
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
            onClick={() => setModal(true)}
            className="submit-relationships-button"
          >
            Add artist genres
          </button>
          <AppModal
            visible={modal}
            setVisible={setModal}
            isHiddenOnClick={false}
          >
            <AddRelationPicklist
              allowEmpty={true}
              type="genre"
              relationshipTypeLabel=""
              onSubmitCallback={onSelectedItemsSubmit}
              multipleSelection={true}
              alreadySelectedItemsIds={form.genres.map(
                (genre) => genre.id
              )}
            ></AddRelationPicklist>
          </AppModal>

          {form.genres.length > 0 && (
            <div className="chosen-items-count">
              Selected {form.genres.length} genres
            </div>
          )}
        </div>
      </div>
      <button
        type="button"
        className="create-btn"
        onClick={() => {
          return;
        }}
      >
        Submit artist
      </button>
    </div>
  );
};

export default ArtistForm;
