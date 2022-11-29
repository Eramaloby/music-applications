import { useNavigate } from 'react-router-dom';
import LiveSearch from '../components/live-search/search-component';
import { Strategy } from '../services/parsing-strategy';

export function SearchWebPage() {
  const router = useNavigate();

  const urlToLogin = 'http://localhost:4200/api/login';

  function onUnlockButtonClick() {
    window.open(urlToLogin, '_blank');
  }

  function callbackDetailsView(instance) {
    router(`/${instance.type}/${instance.spotify_id}`);
  }

  // add default value later
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
      <div className="search-web-conn-block">
        <button className="receive-token-btn" onClick={onUnlockButtonClick}>
          Click to receive authenticity token from Spotify
        </button>
      </div>
      <LiveSearch
        isInputDisabled={false}
        selectorParamsArray={selectorParamsArray}
        isSelectorDefaultValueDisabled={true}
        defaultSelectorValue=""
        searchWordInitialState=""
        endpointUrl="http://localhost:4200/api/web-search?"
        parsingStrategy={Strategy.ParseWebSpotifyObj}
        instanceClickCallback={callbackDetailsView}
        selectorClassName="livesearch-selector"
      ></LiveSearch>
    </div>
  );
}

export default SearchWebPage;
