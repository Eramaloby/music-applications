import React, { useEffect, useState } from 'react';
import './add-relation-picklist.styles.scss';

import { Neo4jItemProperties } from '../../../types';
import { fetchDatabaseItemsByType } from '../../../requests';
import { toast } from 'react-toastify';

type RelationPicklistProps = {
  type: 'genre' | 'artist' | 'playlist' | 'track' | 'album';
  relationshipTypeLabel: string;
  onSubmitCallback: (selectedItems: Neo4jItemProperties[]) => void;
  multipleSelection: boolean;
  allowEmpty: boolean;
  alreadySelectedItemsIds: string[];
};

type RelationPicklistItemProps = {
  row: Row;
  itemType: 'genre' | 'artist' | 'playlist' | 'track' | 'album';
  handleClick: (id: string, newStatus: boolean) => void;
};

type Row = {
  item: Neo4jItemProperties;
  selected: boolean;
};

export const AddRelationPicklist = ({
  type,
  onSubmitCallback,
  multipleSelection,
  allowEmpty,
  alreadySelectedItemsIds,
}: RelationPicklistProps) => {
  const [items, setItems] = useState<
    { item: Neo4jItemProperties; selected: boolean }[]
  >([]);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const wrapper = async () => {
      const response = await fetchDatabaseItemsByType(type);
      
      const alreadySelectedFiltered = response.filter((item) =>
        alreadySelectedItemsIds.includes(item.id)
      );
      const notSelected = response.filter(
        (item) => !alreadySelectedItemsIds.includes(item.id)
      );
      setItems(
        [
          ...alreadySelectedFiltered.map((item) => {
            return { selected: true, item: item };
          }),
          ...notSelected.map((item) => {
            return { selected: false, item: item };
          }),
        ].sort((a, b) => a.item.name.localeCompare(b.item.name))
      );

      // setItems([
      //   ...response.map((item) => {
      //     const selected = alreadySelectedItemsIds
      //     return {
      //       selected: false,
      //       item: item,
      //     };
      //   }),
      // ]);
    };

    wrapper();
  }, []);

  const itemClickCallback = (id: string, newStatus: boolean) => {
    // if item is being selected, need to check for multiple selection
    if (newStatus) {
      const selectedItemIdx = items.findIndex((item) => item.selected);

      // some item already chosen and multiple selection is not allowed
      if (selectedItemIdx !== -1 && !multipleSelection) {
        toast.info(
          'This type of relationship require only one item to be selected.',
          { position: 'top-center' }
        );
        return;
      }
    }

    setItems([
      ...items.map((row) => {
        if (row.item.id === id) {
          return { ...row, selected: newStatus };
        } else {
          return row;
        }
      }),
    ]);
  };

  const submitRelationships = () => {
    const selectedItems = items.filter((row) => row.selected);
    if (!allowEmpty && selectedItems.length === 0) {
      toast.info('At least one item is required to be selected', {
        position: 'top-center',
      });

      return;
    }

    onSubmitCallback(selectedItems.map((row) => row.item));
  };

  return (
    <>
      {/* Ivan: Добавь сюда какое-нибудь оглавление, типо вот отфильтруйте жанры/артисты по имени, у тебя в пропсах ещё подпись, которая обозначает какое отношение сейчас задается, следует её использовать */}
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={'Search'}
      ></input>
      <div className="add-relation-picklist-wrapper">
        {items
          .filter((row) =>
            searchQuery ? row.item.name.includes(searchQuery) : true
          )
          .map((row, index) => {
            return (
              <div className="add-relation-picklist-item-wrapper" key={index}>
                <AddRelationPicklistItem
                  row={row}
                  itemType={type}
                  handleClick={itemClickCallback}
                />
              </div>
            );
          })}
      </div>
      {/* Ivan: сюда стильков */}
      <button type="button" onClick={submitRelationships}>
        Add node(s) to relationship
      </button>
    </>
  );
};

const AddRelationPicklistItem = ({
  row,
  itemType,
  handleClick,
}: RelationPicklistItemProps) => {
  return (
    <>
      <div className="picklist-item">
        {/* Ivan: Нужно выводить какую-то особую информацию характерную данному типу, можно шрифтом меньше */}
        {itemType === 'genre' && <h1>{row.item.name} - genre</h1>}
        {itemType === 'artist' && <h1>{row.item.name} - artist</h1>}
        {itemType === 'album' && <h1>{row.item.name} - album</h1>}
        {itemType === 'track' && <h1>{row.item.name} - track</h1>}
        {itemType === 'playlist' && <h1>{row.item.name} - playlist</h1>}
      </div>
      <button
        className={
          'picklist-item-button-' + (row.selected ? 'checked' : 'unchecked')
        }
        onClick={() => handleClick(row.item.id, !row.selected)}
      >
        {row.selected ? 'remove selection' : 'select'}
      </button>
    </>
  );
};
