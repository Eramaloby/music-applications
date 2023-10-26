import { DbStats, ItemPreview, User } from '../../../types';

import './profile-info.styles.scss';

import { useContext, useEffect, useState } from 'react';
import {
  fetchProfileStats,
  receiveRecommendations,
  updateProfileImage,
} from '../../../requests';
import { AsyncNeo4jTaskMetadata, UserContext } from '../../../contexts/user.context';
import ViewPanelContainer from '../../recently-viewed-panel/view-panel-container';
import FileUploader from '../../file-uploader/file-uploader.component';
import { getBase64FromFile } from '../../../utils';
import SingleTaskState from '../single-task-state/single-task-state.component';

const ProfileInfoComponent = ({ user }: { user: User }) => {
  const [stats, setStats] = useState<DbStats>({
    nodes: 0,
    relationships: 0,
  });


  // profile picture
  const [error, setError] = useState<string>('');
  const handleFileUploading = async (file: File) => {
    if (!file.type.includes('image')) {
      // show error message
      setError('Selected file is not image. Try again.');
    } else {
      // action to upload profile picture
      setError('');
      const imageHash = (await getBase64FromFile(file)) as string;
      await updateProfileImage(user.accessToken, imageHash);
    }
  };

  const { currentUser, currentTasks } = useContext(UserContext);

  const [tasks] = useState<AsyncNeo4jTaskMetadata[]>(currentTasks);

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
      <div className="profile-page-picture-section">
        <div className="profile-picture-text">Your profile picture</div>
        <div className="profile-picture">
          <img
            src={user.profileImageBase64}
            alt=""
            className="profile-picture-img"
          ></img>
        </div>
        <div className="file-uploader-wrapper">
          <FileUploader
            showFileName={false}
            buttonText="Change profile picture"
            handleFile={handleFileUploading}
          ></FileUploader>
        </div>
        {error && <div className="file-validation-message">{error}</div>}
      </div>
      <div className="dashboard-wrapper">
      {tasks.length !== 0 ? (
        <>
          <div className="tasks-header">This sessions tasks:</div>
          <div className="dashboard-map-container">
            {tasks.map((task, index) => {
              return (
                <SingleTaskState key={index} task={task}></SingleTaskState>
              );
            })}
          </div>
        </>
      ) : (
        <div className="no-tasks-message">No tasks history</div>
      )}
    </div>      {recommendations.length !== 0 ? (
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
