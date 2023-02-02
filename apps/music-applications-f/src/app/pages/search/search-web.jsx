import { useNavigate } from 'react-router-dom';
import Search from '../../components/search/search.component';

import './search.styles.scss';
import { parseSpotifyData } from '../../components/view-pages/utils';

export function SearchWebPage() {
  const router = useNavigate();

  const urlToLogin = 'http://localhost:4200/api/login';

  function onUnlockButtonClick() {
    window.open(urlToLogin, '_blank');
    setInterval(() => window.location.reload(), 100);
  }

  function callbackDetailsView(instance) {
    router(`/${instance.type}/${instance.spotify_id}`);
  }

  const searchWordInitialState = 'All';

  const selectorParamsArray = [
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
        selectorParamsArray={selectorParamsArray}
        isSelectorDefaultValueDisabled={false}
        defaultSelectorValue={searchWordInitialState}
        searchWordInitialState={searchWordInitialState}
        endpointUrl="http://localhost:4200/api/web-search?"
        instanceClickCallback={callbackDetailsView}
        selectorClassName="livesearch-selector"
        parser={parseSpotifyData}
      ></Search>
    </div>
  );
}

export default SearchWebPage;
