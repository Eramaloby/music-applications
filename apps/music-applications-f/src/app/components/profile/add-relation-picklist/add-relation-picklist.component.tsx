import React, { useEffect, useState } from 'react';
import './add-relation-picklist.styles.scss';

import {
  AlbumProperties,
  ArtistProperties,
  GenreProperties,
  Neo4jItemProperties,
  TrackProperties,
} from '../../../types';
import { fetchDatabaseItemsByType } from '../../../requests';

type RelationPicklistProps = {
  type: 'genre' | 'artist' | 'playlist' | 'track' | 'album';
  onSubmitCallback: (selectedItems: Neo4jItemProperties[]) => void;
  multipleSelection: boolean;
};

type RelationPicklistItemProps = {
  row: Row;
};

type Row = {
  item: Neo4jItemProperties;
  selected: boolean;
};

export const AddRelationPicklist = ({
  type,
  onSubmitCallback,
  multipleSelection,
}: RelationPicklistProps) => {
  const [items, setItems] = useState<
    { item: Neo4jItemProperties; selected: boolean }[]
  >([]);

  useEffect(() => {
    const wrapper = async () => {
      const response = await fetchDatabaseItemsByType(type);
      setItems([
        ...response.map((item) => {
          return {
            selected: false,
            item: item,
          };
        }),
      ]);
    };

    wrapper();
  }, []);

  return (
    <div className="add-relation-picklist-wrapper">
      {items.map((row, index) => {
        return (
          <div className="add-relation-picklist-item-wrapper" key={index}>
            <AddRelationPicklistItem row={row} />
          </div>
        );
      })}
    </div>
  );
};

const AddRelationPicklistItem = ({ row }: RelationPicklistItemProps) => {
  const [rowSelected, setRowSelected] = useState(row.selected);

  const handleClick = () => {
    row.selected = !row.selected;
    setRowSelected(!rowSelected);
  };

  return (
    <>
      <>
        {(row.item as GenreProperties) && (
          <div className="picklist-item">
            <h1>{row.item.name}</h1>
            <h1>{'genre'}</h1>
          </div>
        )}
        {(row.item as ArtistProperties) && (
          <div className="picklist-item">
            <h1>{row.item.name}</h1>
            <h1>{'artist'}</h1>
          </div>
        )}
        {(row.item as TrackProperties) && (
          <div className="picklist-item">
            <h1>{row.item.name}</h1>
            <h1>{'track'}</h1>
          </div>
        )}
        {(row.item as AlbumProperties) && (
          <div className="picklist-item">
            <h1>{row.item.name}</h1>
            <h1>{'album'}</h1>
          </div>
        )}
      </>
      <button
        className={
          'picklist-item-button-' + (rowSelected ? 'checked' : 'unchecked')
        }
        onClick={() => handleClick()}
      >
        {rowSelected ? 'selected' : 'select'}
      </button>
    </>
  );
};
