import axios from 'axios';
import { useEffect, useState } from 'react';

import './network.styles.scss';
import GoldStar from '../../../assets/gold-star.png';
import Star from '../../../assets/star.png';

const RankingNeuralNetworkPage = () => {
  const [comment, setComment] = useState('');
  const [stars, setStars] = useState([false, false, false, false, false]);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    // add spinner and popup window
    const requestDelay = setTimeout(() => {
      if (comment !== '') {
        // need refactoring
        axios
          .get(`http://localhost:4200/api/network/comment/${comment}`)
          .then((response) => {
            switch (response.data.label) {
              case '1 star':
                setStars([true, false, false, false, false]);
                break;
              case '2 stars':
                setStars([true, true, false, false, false]);
                break;
              case '3 stars':
                setStars([true, true, true, false, false]);
                break;
              case '4 stars':
                setStars([true, true, true, true, false]);
                break;
              case '5 stars':
                setStars([true, true, true, true, true]);
                break;
            }
            setAccuracy(response.data.score);
          });
      }
    }, 500);

    return () => clearTimeout(requestDelay);
  }, [comment]);
  return (
    <div className="ranking-neural-network-page-wrapper">
      <div className="ranking-neural-network-fetch-comments-section">
        <input
          type="text"
          className="fetch-comments-input"
          placeholder="Write comment on song"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></input>
      </div>
      <div className="ranking-neural-network-rating">
        {stars.map((value, index) => (
          <StarPng isActive={value} key={index}></StarPng>
        ))}
      </div>
      <div className="neural-network-accuracy">Accuracy: {accuracy}</div>
    </div>
  );
};

const StarPng = ({ isActive }: { isActive: boolean }) => {
  // could import disable tag function
  return (
    <div className="image-wrapper">
      <img
        src={isActive ? GoldStar : Star}
        width="48"
        height="48"
        alt="Star icon"
      ></img>
    </div>
  );
};

export default RankingNeuralNetworkPage;
