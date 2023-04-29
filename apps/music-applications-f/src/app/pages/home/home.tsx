import axios from 'axios';
import { useEffect, useState } from 'react';

import './home.styles.scss';
import { useNavigate } from 'react-router-dom';
import { DbStats } from '../../types';
import { fetchDatabaseStats } from '../../requests';

const HomePage = () => {
  const router = useNavigate();

  const [stats, setStats] = useState<DbStats>({
    nodes: 0,
    relationships: 0,
  });

  const fetchResults = async () => {
    const result = await fetchDatabaseStats();
    if (result) {
      setStats({...result})
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="home-page-wrapper">
      <div className="home-page-db-stats">
        {stats.nodes ? (
          <div className="db-stats-count-of-nodes">
            Count of nodes in db:{' '}
            <span className="stats-container">{stats.nodes}</span>
          </div>
        ) : (
          <div className="db-stats-count-of-nodes">Wait...</div>
        )}
        {stats.relationships ? (
          <div className="db-stats-count-of-relationships">
            Count of relationships in db:{' '}
            <span className="stats-container">{stats.relationships}</span>
          </div>
        ) : (
          <div className="db-stats-count-of-relationships"></div>
        )}
        <div className="refresh-button-container"></div>
      </div>
      <div className='info-container'>
        <div className="link" onClick={() => router('/signin')}>
          Sign in
        </div>
      </div>
    </div>
  );
};

export default HomePage;
