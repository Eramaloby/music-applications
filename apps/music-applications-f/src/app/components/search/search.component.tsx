import axios from 'axios';
import { useEffect, useState } from 'react';
import './search.styles.scss';
import { DropdownItem } from '../../types';
import InteractiveDropdown from '../interactive-dropdown/interactive-dropdown.component';
import ApplicationSelector from '../ui-elements/selector';

type SearchComponentProps = {
  isInputDisabled: boolean;
  selectorOptions: { value: string; name: string }[];
  instanceClickCallback: (item: DropdownItem) => void;
  endpointUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parser: (data: any) => any;
  selectorClassName: string;
};
const Search = ({
  isInputDisabled,
  selectorOptions,
  endpointUrl,
  selectorClassName,
  instanceClickCallback,
  parser,
}: SearchComponentProps) => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [searchWord, setSearchWord] = useState('all');

  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    // move request code to different class later
    // test
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
        <input
          disabled={isInputDisabled}
          className="livesearch-input"
          value={query}
          type="text"
          placeholder="Write your query here"
          onChange={(e) => setQuery(e.target.value)}
        ></input>
      </div>
      <ApplicationSelector
        selectorClassName={selectorClassName}
        value={searchWord}
        options={selectorOptions}
        onChange={(value: string) => setSearchWord(value)}
      ></ApplicationSelector>
      {query && (
        <InteractiveDropdown
          onItemClickCallback={instanceClickCallback}
          results={results}
        ></InteractiveDropdown>
      )}
      {results.length === 0 && query && (
        <div className="error-message">{errorText}</div>
      )}
    </div>
  );
};

export default Search;
