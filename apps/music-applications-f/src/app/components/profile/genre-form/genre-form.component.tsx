import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

import './genre-form.styles.scss';
import FileUploader from '../../file-uploader/file-uploader.component';
import {
  getBase64FromFile,
  validateFieldRequiredNotEmpty,
} from '../../../utils';

export interface GenreFormFields {
  genreDescription: string;
  genreName: string;
  imageBase64: string;
}

const GenreForm = () => {
  const [form, setForm] = useState<GenreFormFields>({
    genreDescription: '',
    genreName: '',
    imageBase64: '',
  });

  const [errors, setErrors] = useState<GenreFormFields>({
    genreDescription: '',
    genreName: '',
    imageBase64: '',
  });

  const onGenreFileSelected = async (file: File) => {
    if (!file.type.includes('image')) {
      setErrors({
        ...errors,
        imageBase64: 'File is required to be an image.',
      });

      return;
    } else {
      const imageHash = (await getBase64FromFile(file)) as string;
      setForm({ ...form, imageBase64: imageHash });
      setErrors({ ...errors, imageBase64: '' });
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
      genreName: validateFieldRequiredNotEmpty(form.genreName, 'Name'),
      genreDescription: validateFieldRequiredNotEmpty(
        form.genreDescription,
        'Description'
      ),
      imageBase64: validateFieldRequiredNotEmpty(form.imageBase64, 'Image'),
    };

    if (Object.values(localErrors).some((msg) => Boolean(msg))) {
      setErrors({ ...localErrors });
      return;
    }

    // validation passed
    // invoke callback
  };

  return (
    <div className="form-wrapper">
      <div className="form-header">Fill required fields</div>
      <div className="form-controls">
        <div className="control-wrapper">
          <TextField
            name="genreName"
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
            value={form.genreName}
            onChange={onFormControlsChange}
            error={Boolean(errors.genreName)}
            helperText={errors.genreName}
          ></TextField>
        </div>
        <div className="control-wrapper">
          <TextField
            name="genreDescription"
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
            value={form.genreDescription}
            onChange={onFormControlsChange}
            error={Boolean(errors.genreDescription)}
            helperText={errors.genreDescription}
          ></TextField>
        </div>

        <div className="control-wrapper">
          <div style={{ width: '80%' }}>
            <FileUploader
              handleFile={onGenreFileSelected}
              buttonText="Upload genre image"
            ></FileUploader>
          </div>

          {errors.imageBase64 && (
            <div className="image-validation-message">{errors.imageBase64}</div>
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
