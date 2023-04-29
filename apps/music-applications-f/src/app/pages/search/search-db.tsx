import { useState } from 'react';

import DatabaseItemPage from '../../components/view-pages/database-pages/item-view';
import AppModal from '../../components/ui-elements/modal';

import './search.styles.scss';
import { parseNeo4jRecords } from '../../utils';
import Search from '../../components/search/search.component';
import { DropdownItem, Neo4jDbItem } from '../../types';
import { fetchDatabaseItem } from '../../requests';

const SearchPageDb = () => {
  const selectorParamsArray = [
    { value: 'artist', name: 'Artists' },
    { value: 'track', name: 'Tracks' },
    { value: 'genre', name: 'Genres' },
    { value: 'album', name: 'Albums' },
    { value: 'playlist', name: 'Playlist' },
  ];
  const endpointUrl = 'http://localhost:4200/api/search?';
  const searchWordInitialState = 'All';

  const [modal, setModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Neo4jDbItem>();

  // callbacks to pass
  const callbackOnInstanceClick = async (instance: DropdownItem) => {
    const item = await fetchDatabaseItem(instance.type, instance.label);
    if (item) {
      setSelectedItem(item);
      setModal(true);
    }
  };

  const handleRelationClick = async (type: string, name: string) => {
    const item = await fetchDatabaseItem(type, name);
    if (item) {
      setSelectedItem(item);
    }
  };

  return (
    <div className="search-page-wrapper">
      <div className="search-page-title">
        <p>Type to search from graph database...</p>
      </div>
      <Search
        isInputDisabled={false}
        selectorOptions={selectorParamsArray}
        instanceClickCallback={callbackOnInstanceClick}
        isSelectorDefaultValueDisabled={false}
        searchWordInitialState={searchWordInitialState}
        endpointUrl={endpointUrl}
        parser={parseNeo4jRecords}
        selectorClassName="livesearch-selector"
      ></Search>
      <div>
        {selectedItem && (
          <AppModal
            visible={modal}
            setVisible={setModal}
            isHiddenOnClick={false}
          >
            {/* Write Classes That decompose item */}
            <DatabaseItemPage
              item={selectedItem}
              routingCallback={handleRelationClick}
            ></DatabaseItemPage>
          </AppModal>
        )}
      </div>
    </div>
  );
};

export default SearchPageDb;
