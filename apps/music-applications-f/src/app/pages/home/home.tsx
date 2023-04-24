import axios from 'axios';
import { useEffect, useState } from 'react';

import './home.styles.scss';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const router = useNavigate();

  const [stats, setStats] = useState<{ nodesCount: number; relCount: number }>({
    nodesCount: 0,
    relCount: 0,
  });

  const fetchResults = async () => {
    axios.get('http://localhost:4200/api/db-stats').then((response) => {
      setStats({ nodesCount: response.data[0], relCount: response.data[1] });
    });
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // const onRefreshButtonClick = () => {
  //   fetchResults();
  // };

  return (
    <div className="home-page-wrapper">
      <div className="home-page-db-stats">
        {stats.nodesCount ? (
          <div className="db-stats-count-of-nodes">
            Count of nodes in db:{' '}
            <span className="stats-container">{stats.nodesCount}</span>
          </div>
        ) : (
          <div className="db-stats-count-of-nodes">Wait...</div>
        )}
        {stats.relCount ? (
          <div className="db-stats-count-of-relationships">
            Count of relationships in db:{' '}
            <span className="stats-container">{stats.relCount}</span>
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
