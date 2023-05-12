import { DbStats, ItemPreview, User } from '../../../types';

import './profile-info.styles.scss';

import { useContext, useEffect, useState } from 'react';
import { fetchProfileStats, receiveRecommendations } from '../../../requests';
import { UserContext } from '../../../contexts/user.context';
import ViewPanelContainer from '../../recently-viewed-panel/view-panel-container';

const ProfileInfoComponent = ({ user }: { user: User }) => {
  const [stats, setStats] = useState<DbStats>({
    nodes: 0,
    relationships: 0,
  });

  const { currentUser } = useContext(UserContext);

  const [recommendations, setRecommendations] = useState<ItemPreview[]>([]);

  const fetchRecommendations = async () => {
    const response = await receiveRecommendations(currentUser!.accessToken);
    if (response) {
      setRecommendations([...response]);
    }
  };

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

    fetchRecommendations();
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
      {recommendations.length !== 0 && (
        <div className="recommendation-panel">
          <ViewPanelContainer
            title="According to your taste, you would like:"
            items={recommendations}
            containerClassName="recommendation-panel"
          ></ViewPanelContainer>
        </div>
      )}
    </div>
  );
};

export default ProfileInfoComponent;
