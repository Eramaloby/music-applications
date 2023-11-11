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
  item: Neo4jItemProperties;
  selected: boolean;
  onSelectedCallback: (selectedItemId: string) => void;
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

  const handleClick = (id: string) => {
    setItems([
      ...items.map((value) => {
        if (value.item.id === id) {
          return { item: value.item, selected: !value.selected };
        } else {
          return value;
        }
      }),
    ]);
  };

  return (
    <div className="add-relation-picklist-wrapper">
      {items.map((row, index) => {
        return (
          <div className="add-relation-picklist-item-wrapper" key={index}>
            <AddRelationPicklistItem
              item={row.item}
              selected={row.selected}
              onSelectedCallback={handleClick}
            />
          </div>
        );
      })}
    </div>
  );
};

const AddRelationPicklistItem = ({
  item,
  selected,
  onSelectedCallback,
}: RelationPicklistItemProps) => {
  return (
    <>
      <>
        {(item as GenreProperties) && (
          <div className="picklist-item">
            <h1>{item.name}</h1>
            <h1>{'genre'}</h1>
          </div>
        )}
        {(item as ArtistProperties) && (
          <div className="picklist-item">
            <h1>{item.name}</h1>
            <h1>{'artist'}</h1>
          </div>
        )}
        {(item as TrackProperties) && (
          <div className="picklist-item">
            <h1>{item.name}</h1>
            <h1>{'track'}</h1>
          </div>
        )}
        {(item as AlbumProperties) && (
          <div className="picklist-item">
            <h1>{item.name}</h1>
            <h1>{'album'}</h1>
          </div>
        )}
      </>
      <button
        className={
          'picklist-item-button-' + (selected ? 'checked' : 'unchecked')
        }
        onClick={() => onSelectedCallback(item.id)}
      >
        {selected ? 'selected' : 'select'}
      </button>
    </>
  );
};
