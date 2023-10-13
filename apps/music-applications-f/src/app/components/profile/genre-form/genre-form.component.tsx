import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import './genre-form.styles.scss';

export interface GenreFormFields {
  description: string;
  name: string;
  imageBase64: string;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const GenreForm = ({
  activeForm,
  setActiveForm,
}: {
  activeForm: GenreFormFields;
  setActiveForm: (form: GenreFormFields) => void;
}) => {
  const onGenreNameChange = (name: string) => {
    setActiveForm({ ...activeForm, name });
  };

  const onGenreDescriptionChange = (description: string) => {
    setActiveForm({ ...activeForm, description });
  };

  return (
    <div className="form-wrapper">
      <div className="form-header">Fill required fields</div>
      <div className="form-controls">
        <div className="control-wrapper">
          <TextField
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
            value={activeForm.name}
            onChange={(e) => onGenreNameChange(e.target.value)}
          ></TextField>
        </div>
        <div className="control-wrapper">
          <TextField
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
            value={activeForm.description}
            onChange={(e) => onGenreDescriptionChange(e.target.value)}
          ></TextField>
        </div>

        <div className="control-wrapper">
          <Button component="label" variant="contained">
            Upload genre image
            <VisuallyHiddenInput
              type="file"
              onChange={(e) => console.log(e)}
            ></VisuallyHiddenInput>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenreForm;
