import './search.styles.scss';
import { parseNeo4jRecords } from '../../utils';
import Search from '../../components/search/search.component';
import { DropdownItem } from '../../types';

const SearchPageDb = () => {
  const selectorParamsArray = [
    { value: 'all', name: 'All' },
    { value: 'artist', name: 'Artists' },
    { value: 'track', name: 'Tracks' },
    { value: 'genre', name: 'Genres' },
    { value: 'album', name: 'Albums' },
    { value: 'playlist', name: 'Playlist' },
  ];
  const endpointUrl = 'http://localhost:4200/api/search?';
  // callbacks to pass
  const callbackOnInstanceClick = async (instance: DropdownItem) => {
    // route to db page
    window.open(
      `${window.location.origin}/items/${instance.type}/${instance.label}`,
      '_blank'
    );
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
        endpointUrl={endpointUrl}
        parser={parseNeo4jRecords}
        selectorClassName="livesearch-selector"
      ></Search>
    </div>
  );
};

export default SearchPageDb;
