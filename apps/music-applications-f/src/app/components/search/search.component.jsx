import axios from 'axios';
import { useEffect, useState } from 'react';
import ApplicationSelect from '../ui-elements/select';
import InteractiveDropdown from '../interactive-dropdown/interactive-dropdown.component';
import './search.styles.scss';
import { parseNeo4jRecords } from '../view-pages/utils';

// refactor this component later on
export function Search({
  isInputDisabled,
  isSelectorDefaultValueDisabled,
  selectorParamsArray,
  instanceClickCallback,
  searchWordInitialState,
  endpointUrl,
  parser,
  selectorClassName,
}) {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [searchWord, setSearchWord] = useState(
    searchWordInitialState.toLowerCase()
  );

  const [errorText, setErrorText] = useState('');

  const disableTag = (isDisabled) => (isDisabled ? 'disabled' : '');

  useEffect(() => {
    // move request code to different class later
    const searchDelayTimer = setTimeout(() => {
      if (query !== '' && searchWord !== '') {
        axios.get(`${endpointUrl}${searchWord}=${query.toLowerCase()}`).then(
          (response) => {
            setResults(parser(response.data));

            if (results.length === 0) {
              setErrorText('Nothing was found');
            }
          },
          (reason) => {
            setErrorText('Before using search acquire access token');
          }
        );
      }
    }, 400);

    return () => clearTimeout(searchDelayTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, searchWord]);

  // need to style empty divs and when promise is rejected and when result is empty
  return (
    <div className="livesearch-wrapper">
      <div className="livesearch-input-container">
        <ApplicationSelect
          isDefaultDisabled={disableTag(isSelectorDefaultValueDisabled)}
          defaultValueName={searchWordInitialState}
          defaultValue={searchWordInitialState.toLowerCase()}
          value={searchWord}
          onChange={(value) => setSearchWord(value)}
          options={selectorParamsArray}
          selectorClassName={selectorClassName}
        ></ApplicationSelect>
        <input
          disabled={disableTag(isInputDisabled)}
          className="livesearch-input"
          value={query}
          type="text"
          placeholder="Write your query here"
          onChange={(e) => setQuery(e.target.value)}
        ></input>
      </div>
      {query !== '' ? (
        <div className="dropdown-container">
          <InteractiveDropdown
            onClickCallback={instanceClickCallback}
            list={results}
            ocurredError={errorText}
            setOcurredError={setErrorText}
          ></InteractiveDropdown>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Search;
