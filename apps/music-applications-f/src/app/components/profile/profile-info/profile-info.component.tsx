import { User } from '../../../types';

import './profile-info.styles.scss';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../utils';

interface ProfileDbStats {
  countOfNodes: number;
  countOfRelationships: number;
}

const ProfileInfoComponent = ({ user }: { user: User }) => {
  const [stats, setStats] = useState<ProfileDbStats>({
    countOfNodes: 0,
    countOfRelationships: 0,
  });

  useEffect(() => {
    const asyncWrapper = async () => {
      if (user) {
        // request

        try {
          const response = await axios.get(`${baseUrl}/profile/stats`, {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          });

          setStats({
            countOfNodes: response.data[0],
            countOfRelationships: response.data[1],
          });
        } catch (error) {
          console.log(error);
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
            Count of relations saved by you: {stats.countOfRelationships}
          </div>
          <div className="stats-instances">
            Count of nodes saved by you: {stats.countOfNodes}
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
