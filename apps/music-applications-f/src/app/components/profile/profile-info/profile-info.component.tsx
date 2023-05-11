import { DbStats, User } from '../../../types';

import './profile-info.styles.scss';

import { useEffect, useState } from 'react';
import { fetchProfileStats } from '../../../requests';

const ProfileInfoComponent = ({ user }: { user: User }) => {
  const [stats, setStats] = useState<DbStats>({
    nodes: 0,
    relationships: 0,
  });

  useEffect(() => {
    const asyncWrapper = async () => {
      if (user) {
        // request
        const data = await fetchProfileStats(user.accessToken);
        if (data) {
          setStats({ ...data });
        }
      }
    };

    asyncWrapper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="profile-page-content">
      <div className="profile-information-panel">
        <div className="greeting-message">Welcome, {user.username} </div>
        <div className="user-stats">
          <div className="stats-relation">
            Count of relations saved by you: {stats.relationships}
          </div>
          <div className="stats-instances">
            Count of nodes saved by you: {stats.nodes}
          </div>
        </div>
      </div>
      <div className="recommendation-panel">
        <div className="recommendation-title">
          According to your taste, you would like:
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoComponent;
