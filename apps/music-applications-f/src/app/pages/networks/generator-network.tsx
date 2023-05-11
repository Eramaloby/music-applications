import { useState } from 'react';
import { LyricsNeuralNetworkParams } from '../../types';
import './network.styles.scss';
import AppModal from '../../components/ui-elements/modal';

const LyricsGeneratorNetwork = () => {
  const selectorOptions = [
    { name: 'Kanye West', value: 'kanye_west' },
    { name: 'Eminem', value: 'eminem' },
    { name: 'Pi`erre Bourne', value: 'pierre_bourne' },
  ];

  const [modal, setModal] = useState<boolean>(false);

  const [params, setParams] = useState<LyricsNeuralNetworkParams>({
    author: '',
    first_line: '',
    length: 100,
    freedom_index: 0,
    stop_words: [],
    isExplicit: false,
  });

  const handleAuthorChange = (value: string) => {
    setParams({ ...params, author: value });
  };

  const handleFirstLineChange = (value: string) => {
    setParams({ ...params, first_line: value });
  };

  const handleLengthChange = (value: number) => {
    setParams({ ...params, length: value });
  };

  const handleFreedomIndexChange = (value: number) => {
    setParams({ ...params, freedom_index: value });
  };

  const handleStopWordsChange = (value: string) => {
    setParams({ ...params, stop_words: value.split(' ') });
  };

  const handleExplicitChange = () => {
    setParams({ ...params, isExplicit: !params.isExplicit });
  };

  return (
    <div className="generate-lyrics-page-wrapper">
      <div className="generate-lyrics-page-title">
        Generate your unique lyrics
      </div>

      <div className="generate-lyrics-page-params">
        <div className="generate-lyrics-page-selector-wrapper">
          <div className="generate-lyrics-page-selector-label">
            Specify author to create authentic style
          </div>
          <select
            className="generate-lyrics-page-selector"
            placeholder="Please, choose one author"
            value={params.author}
            onChange={(e) => handleAuthorChange(e.target.value)}
          >
            <option>Please, choose one author</option>
            {selectorOptions.map((opt, index) => (
              <option value={opt.value} key={index}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>
        <div className="generate-lyrics-page-input-wrapper">
          <div className="generate-lyrics-page-input-label">
            Please, enter first line of lyrics
          </div>
          <input
            type="text"
            className="generate-lyrics-page-input"
            placeholder="First line in your generated lyrics"
            value={params.first_line}
            onChange={(e) => handleFirstLineChange(e.target.value)}
          ></input>
        </div>
        <div className="generate-lyrics-page-additional-params-title">
          Specify more info for neural network
        </div>
        <div className="generate-lyrics-page-additional-params">
          <div className="generate-lyrics-page-additional-params-wrapper">
            <div className="generate-lyrics-page-additional-params-label">
              Enter length of generated text
            </div>
            <input
              type="number"
              className="generate-lyrics-page-input-length"
              value={params.length}
              onChange={(e) =>
                handleLengthChange(e.target.value as unknown as number)
              }
            ></input>
          </div>
          <div className="generate-lyrics-page-additional-params-wrapper">
            <div className="generate-lyrics-page-additional-params-label">
              Enter number of neural network freedom parameter
            </div>
            <input
              type="number"
              className="generate-lyrics-page-input-freedom"
              value={params.freedom_index}
              onChange={(e) =>
                handleFreedomIndexChange(e.target.value as unknown as number)
              }
            ></input>
          </div>

          <div className="generate-lyrics-page-additional-params-wrapper">
            <div className="generate-lyrics-page-additional-params-label">
              Specify some stop-words
            </div>
            <input
              type="text"
              className="generate-lyrics-page-input-stop-words"
              value={params.stop_words.join(' ')}
              onChange={(e) => handleStopWordsChange(e.target.value)}
              placeholder='Separate words by space'
            ></input>
          </div>

          <div className="generate-lyrics-page-additional-params-wrapper-checkbox">
            <div className="generate-lyrics-page-additional-params-label">
              Choose whether or not include explicit lyrics
            </div>
            <input
              type="checkbox"
              className="generate-lyrics-page-input-explicit-content"
              checked={params.isExplicit}
              onChange={() => handleExplicitChange()}
            ></input>
          </div>
        </div>
      </div>

      <div className="generate-lyrics-page-btn-wrapper">
        <div
          className="generate-lyrics-page-btn-wrapper"
          onClick={() => setModal(true)}
        >
          Generate lyrics
        </div>
      </div>

      <AppModal visible={modal} setVisible={setModal} isHiddenOnClick={false}>
        <div className="result-wrapper">
          <div>Author: {params.author}</div>
          <div>First line: {params.first_line}</div>
          <div>Freedom index: {params.freedom_index}</div>
          <div>Explicit: {params.isExplicit ? 'yes' : 'no'}</div>
          <div>Length: {params.length}</div>
          <div>Stop words: {params.stop_words.join(', ')}</div>
        </div>
      </AppModal>
    </div>
  );
};

export default LyricsGeneratorNetwork;
