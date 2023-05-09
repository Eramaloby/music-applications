import Search from '../../components/search/search.component';

import './search.styles.scss';
import { parseSpotifyData } from '../../utils';
import { DropdownItem } from '../../types';

const SearchWebPage = () => {
  const urlToLogin = 'http://localhost:4200/api/login';

  const onUnlockButtonClick = () => {
    window.open(urlToLogin, '_blank');
    setInterval(() => window.location.reload(), 100);
  };

  const callbackDetailsView = (instance: DropdownItem) => {
    window.open(
      `${window.location.origin}/${instance.type}/${instance.spotify_id}`,
      '_blank'
    );
  };

  const selectorParamsArray = [
    { value: 'all', name: 'All' },
    { value: 'track', name: 'Tracks' },
    { value: 'artist', name: 'Artists' },
    { value: 'playlist', name: 'Playlists' },
    { value: 'album', name: 'Albums' },
  ];

  return (
    <div className="search-web-page-wrapper">
      <div className="search-web-page-title">
        <p>Type to search from web...</p>
      </div>
      <div>
        <button className="receive-token-btn" onClick={onUnlockButtonClick}>
          Click to receive authenticity token from Spotify
        </button>
      </div>
      <Search
        isInputDisabled={false}
        selectorOptions={selectorParamsArray}
        endpointUrl="http://localhost:4200/api/web-search?"
        instanceClickCallback={callbackDetailsView}
        selectorClassName="livesearch-selector"
        parser={parseSpotifyData}
      ></Search>
    </div>
  );
};

export default SearchWebPage;
