import { TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { validateFieldRequiredNotEmpty } from '../../../../utils';
import { fetchDatabaseItemsByType } from '../../../../requests';
import AppModal from '../../../../components/ui-elements/modal';
import { AddRelationPicklist } from '../../add-relation-picklist/add-relation-picklist.component';
import { Neo4jItemProperties } from '../../../../types';

export interface ArtistFormFields {
  artistName: string;
  artistType: string;
  artistDescription: string;
  artistImageBase64: string;

  artistRelatedGenres: Neo4jItemProperties[];
}

export interface ArtistFormFieldsErrors {
  artistName: string;
  artistType: string;
  artistDescription: string;
  artistImageBase64: string;
  artistRelatedGenres: string;
}

const ArtistForm = () => {
  const [form, setForm] = useState<ArtistFormFields>({
    artistName: '',
    artistType: '',
    artistDescription: '',
    artistImageBase64: '',
    artistRelatedGenres: [],
  });

  const [errors, setErrors] = useState<ArtistFormFieldsErrors>({
    artistName: '',
    artistType: '',
    artistDescription: '',
    artistImageBase64: '',
    artistRelatedGenres: '',
  });

  const [modal, setModal] = useState(false);

  const onSelectedItemsSubmit = (selectedItems: Neo4jItemProperties[]) => {
    setForm({ ...form, artistRelatedGenres: [...selectedItems] });
    setModal(false);
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

  // useEffect(() => {
  //   // const wrapper = async () => {
  //   //   const result = await fetchDatabaseItemsByType('track');
  //   //   console.log(result);
  //   // };

  //   // wrapper();
  // }, [])

  return (
    <div className="form-wrapper">
      <div className="form-header">Fill required fields</div>
      <div className="form-controls">
        <div className="control-wrapper">
          <Tooltip
            title="Artist name, real person name, band or group name"
            placement="top"
          >
            <TextField
              name="artistName"
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
              value={form.artistName}
              onChange={onFormControlsChange}
              error={Boolean(errors.artistName)}
              helperText={errors.artistName}
            ></TextField>
          </Tooltip>
        </div>
        <div className="control-wrapper">
          <Tooltip
            title="Could be singer, band, guitarist, etc"
            placement="top"
          >
            <TextField
              name="artistType"
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
              value={form.artistType}
              onChange={onFormControlsChange}
              error={Boolean(errors.artistType)}
              helperText={errors.artistType}
            ></TextField>
          </Tooltip>
        </div>
        <div className="control-wrapper">
          <Tooltip
            title="Something that would describe an artist or short biography"
            placement="top"
          >
            <TextField
              name="artistDescription"
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
              value={form.artistDescription}
              onChange={onFormControlsChange}
              error={Boolean(errors.artistDescription)}
              helperText={errors.artistDescription}
            ></TextField>
          </Tooltip>
        </div>
        <div className="control-wrapper">
          {/* Ivan: сделать стильки к этой кнопке и остальным похожим в форме */}
          <button onClick={() => setModal(true)}>Add artist genres</button>
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
              alreadySelectedItemsIds={form.artistRelatedGenres.map(
                (genre) => genre.id
              )}
            ></AddRelationPicklist>
          </AppModal>

          {form.artistRelatedGenres.length > 0 && (
            <div className="chosen-items-count">
              Selected {form.artistRelatedGenres.length} genres
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistForm;
