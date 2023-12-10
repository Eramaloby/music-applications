/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

import '../../common.styles.scss';
import { Tooltip } from '@mui/material';
import FileUploader from 'apps/music-applications-f/src/app/components/file-uploader/file-uploader.component';
import {
  getBase64FromFile,
  validateFieldRequiredNotEmpty,
} from 'apps/music-applications-f/src/app/utils';
import {
  GenreModel,
  Neo4jModel,
} from 'apps/music-applications-f/src/app/types';

export interface GenreFormFields {
  description: string;
  name: string;
  image: string;
}

const GenreForm = ({
  requestCallback,
  initValues,
}: {
  requestCallback: (
    model: Neo4jModel,
    type: 'artist' | 'genre' | 'playlist' | 'track' | 'album'
  ) => void;
  initValues?: GenreFormFields,
}) => {
  const [form, setForm] = useState<GenreFormFields>({
    description: initValues?.description ?? '',
    name: initValues?.name ?? '',
    image: initValues?.image ?? '',
  });

  const [errors, setErrors] = useState<GenreFormFields>({
    description: '',
    name: '',
    image: '',
  });

  const onGenreFileSelected = async (file: File) => {
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

  const onSubmitButtonClick = () => {
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
      image: validateFieldRequiredNotEmpty(form.image, 'Image'),
    };

    if (Object.values(localErrors).some((msg) => Boolean(msg))) {
      setErrors({ ...localErrors });
      return;
    }

    const model: GenreModel = {
      name: form.name,
      description: form.description,
      image: form.image,
    };

    requestCallback(model, 'genre');
  };

  return (
    <div className="form-wrapper">
      <div className="form-header">Fill required genre fields</div>
      <div className="form-controls">
        <div className="control-wrapper">
          <Tooltip
            title="Something that will identify genre among others"
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
              label={'Enter genre name'}
              value={form.name}
              onChange={onFormControlsChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
            ></TextField>
          </Tooltip>
        </div>
        <div className="control-wrapper">
          <Tooltip title="Describe music in genre in few words" placement="top">
            <TextField
              name="description"
              className="form-value-input"
              InputLabelProps={{
                style: { color: 'white', fontWeight: '500' },
              }}
              inputProps={{
                style: {
                  color: 'white',
                  fontWeight: '400',
                  height: '15px',
                },
              }}
              color={'primary'}
              label={'Enter genre description'}
              value={form.description}
              onChange={onFormControlsChange}
              error={Boolean(errors.description)}
              helperText={errors.description}
            ></TextField>
          </Tooltip>
        </div>

        <div className="control-wrapper">
          <div style={{ width: '70%' }}>
            <FileUploader
              handleFile={onGenreFileSelected}
              buttonText="Upload genre image"
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
      </div>
      <button
        type="button"
        className="create-btn"
        onClick={onSubmitButtonClick}
      >
        Submit genre
      </button>
    </div>
  );
};

export default GenreForm;
