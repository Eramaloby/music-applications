import axios from 'axios';
import { useContext, useEffect, useState } from 'react';

import background_image from '../../../assets/backgr.png';

import './home.styles.scss';
import { useNavigate } from 'react-router-dom';
import { DbStats } from '../../types';
import { fetchDatabaseStats } from '../../requests';

import ElementList from '../../components/ui-elements/el-list';
import { UserContext } from '../../contexts/user.context';

const HomePage = () => {
  const router = useNavigate();

  const [stats, setStats] = useState<DbStats>({
    nodes: 0,
    relationships: 0,
  });

  const { currentUser } = useContext(UserContext);

  const [info, setInfo] = useState([
    {
      header: 'User system',
      src: '../../../assets/user.png',
      content: `System provides a high level of security, protecting users' personal data
    and content from unauthorized access. Make your experience more secure`,
    },
    {
      header: 'Recommendations',
      src: '../../../assets/like.png',
      content: `Tired of music in your playlist?
    Based on your recent preferences, you will receive many recommendations,
    that will always help you discover something new`,
    },
    {
      header: 'Knowledge base',
      src: '../../../assets/connection.png',
      content: `Constantly expanding and improving the graph knowledge base will allow you to
    quickly and efficiently search for the queries you need, as well as navigate
    and use related elements.`,
    },
    {
      header: 'Explore Web',
      src: '../../../assets/spotify.png',
      content: `In case you still lack the knowledge base, you can use the database,
    provided by the Spotify API. Listen to tracks, get lyrics, add entities
    to the graph knowledge base and much more`,
    },
  ]);

  const fetchResults = async () => {
    const result = await fetchDatabaseStats();
    if (result) {
      setStats({ ...result });
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div
      className="home-page-wrapper"
      style={{ backgroundImage: `url(${background_image})` }}
    >
      <div className="home-page-welcome">
        <h1>Welcome to music-applications</h1>
        <h3>Join the multi-million user family</h3>
      </div>
      <div className="home-page-db-stats">
        <ElementList items={info} />
        <div className="refresh-button-container"></div>
      </div>
      {currentUser ? (
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
        </div>
      ) : (
        <div className="info-container">
          <div className="text">
            This and even more you can receive after authorization. Sign in and
            get a extended personalized experience in our service.
          </div>
          <div className="link" onClick={() => router('/signin')}>
            Sign in
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
