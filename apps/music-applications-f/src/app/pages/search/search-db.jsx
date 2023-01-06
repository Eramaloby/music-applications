import { useState } from 'react';
import axios from 'axios';

import Search from '../../components/search/search.component';
import { Strategy } from '../../components/view-pages/parsing-strategy';
import AppModal from '../../components/ui-elements/modal';
import DatabaseItemPage from '../../components/view-pages/database-pages/item-view';

import './search.styles.scss';

export function SearchPageDb() {
  // props to pass
  const selectorParamsArray = [
    { value: 'artist', name: 'Artists' },
    { value: 'track', name: 'Tracks' },
    { value: 'genre', name: 'Genres' },
    { value: 'album', name: 'Albums' },
    { value: 'playlist', name: 'Playlist' },
  ];
  const endpointUrl = 'http://localhost:4200/api/search?';
  const parsingStrategy = Strategy.ParseGraphDbObj;
  const searchWordInitialState = 'All';

  const [modal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  // callbacks to pass
  function callbackOnInstanceClick(instance) {
    axios
      .get(
        `http://localhost:4200/api/node-relation/${instance.type[0]}/${instance.label}`
      )
      .then((response) => {
        setSelectedItem(Strategy.ParseGraphObjWithRelations(response.data));
      });

    setModal(true);
  }

  return (
    <div className="search-page-wrapper">
      <div className="search-page-title">
        <p>Type to search from graph database...</p>
      </div>
      <Search
        isInputDisabled={false}
        selectorParamsArray={selectorParamsArray}
        instanceClickCallback={callbackOnInstanceClick}
        isSelectorDefaultValueDisabled={false}
        defaultSelectorValue={searchWordInitialState}
        searchWordInitialState={searchWordInitialState}
        endpointUrl={endpointUrl}
        parsingStrategy={parsingStrategy}
        selectorClassName="livesearch-selector"
      ></Search>
      <div>
        {selectedItem && (
          <AppModal
            visible={modal}
            setVisible={setModal}
            notHideOnClick={false}
          >
            {/* Write Classes That decompose item */}
            <DatabaseItemPage item={selectedItem}></DatabaseItemPage>
          </AppModal>
        )}
      </div>
    </div>
  );
}

export default SearchPageDb;
