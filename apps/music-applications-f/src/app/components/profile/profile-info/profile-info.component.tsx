import { DbStats, ItemPreview, User } from '../../../types';

import './profile-info.styles.scss';

import { useContext, useEffect, useState } from 'react';
import { fetchProfileStats, receiveRecommendations } from '../../../requests';
import {
  AsyncNeo4jTaskMetadata,
  UserContext,
} from '../../../contexts/user.context';
import ViewPanelContainer from '../../recently-viewed-panel/view-panel-container';
import AsyncTasksDashboard from '../async-tasks-dashboard/async-tasks-dashboard.component';

const ProfileInfoComponent = ({ user }: { user: User }) => {
  const [stats, setStats] = useState<DbStats>({
    nodes: 0,
    relationships: 0,
  });

  const { currentUser, currentTasks } = useContext(UserContext);

  const [recommendations, setRecommendations] = useState<ItemPreview[]>([]);

  const fetchRecommendations = async () => {
    if (currentUser) {
      const response = await receiveRecommendations(currentUser.accessToken);
      if (response) {
        setRecommendations([...response]);
      }
    }
  };

  // TODO: write message what job is currently working
  useEffect(() => {
    const asyncWrapper = async () => {
      if (user) {
        // request
        const data = await fetchProfileStats(user.accessToken);
        await fetchRecommendations();
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
      <AsyncTasksDashboard tasks={currentTasks}></AsyncTasksDashboard>
      {recommendations.length !== 0 ? (
        <div className="recommendation-panel">
          <ViewPanelContainer
            title="According to your taste, you would like:"
            items={recommendations}
            containerClassName="recommendation-panel"
          ></ViewPanelContainer>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default ProfileInfoComponent;
