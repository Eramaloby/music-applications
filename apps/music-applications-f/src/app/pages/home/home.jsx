import axios from 'axios';
import { useState } from 'react';

import './home.styles.scss'

export function HomePage() {
  const [stats, setStats] = useState({});

  const onRefreshButtonClick = () => {
    axios.get('http://localhost:4200/api/db-stats').then((response) => {
      setStats({ nodesCount: response.data[0], relCount: response.data[1] });
    });
  };

  return (
    <div className="home-page-wrapper">
      <div className="home-page-db-stats">
        {stats.nodesCount ? (
          <div className="db-stats-count-of-nodes">
            Count of nodes in db:{' '}
            <span className="stats-container">{stats.nodesCount}</span>
          </div>
        ) : (
          <div className="db-stats-count-of-nodes">Refresh to get count</div>
        )}
        {stats.relCount ? (
          <div className="db-stats-count-of-relationships">
            Count of relationships in db:{' '}
            <span className="stats-container">{stats.relCount}</span>
          </div>
        ) : (
          <div className="db-stats-count-of-relationships"></div>
        )}
        <div className="refresh-button-container">
          <button
            className="refresh-button"
            onClick={() => onRefreshButtonClick()}
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
