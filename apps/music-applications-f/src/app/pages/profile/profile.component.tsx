import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/user.context';
import { Navigate, useNavigate } from 'react-router-dom';

import './profile.styles.scss';
import { FulfilledTask, ItemPreview, User } from '../../types';
import FileUploader from '../../components/file-uploader/file-uploader.component';
import { getBase64FromFile, intersectTwoArrays } from '../../utils';
import {
  fetchProfileTaskHistory,
  getUserNotifications,
  receiveRecommendations,
  sendMarkNotificationAsViewed,
  updateProfileImage,
} from '../../requests';
import { toast } from 'react-toastify';
import {
  AsyncNeo4jTaskMetadata,
  TaskContext,
} from '../../contexts/task.context';
import SingleTaskState from './single-task-state/single-task-state.component';
import TaskHistoryItem from './task-history/task-history.component';
import ViewPanelContainer from '../../components/recently-viewed-panel/view-panel-container';

export interface ProfileNotification {
  id: string;
  actorUsername: string;
  receiverUsername: string;
  state: 'subscribed' | 'unsubscribed';
  viewed: boolean;
  createdAt: Date;
}

const Profile = () => {
  // const [pageState, setPageState] = useState<ProfilePageStates>(
  //   ProfilePageStates.DEFAULT
  // );

  // const switchToDefaultView = () => {
  //   setPageState(ProfilePageStates.DEFAULT);
  // };

  const router = useNavigate();

  const { currentUser, updateCurrentUser } = useContext(UserContext);
  const { tasks } = useContext(TaskContext);

  const [currentImageUrl, setCurrentImageUrl] = useState<string>(
    currentUser?.profileImageBase64 ?? ''
  );
  const [tasksState] = useState<AsyncNeo4jTaskMetadata[]>(tasks);
  const [taskHistory, setTaskHistory] = useState<FulfilledTask[]>([]);
  const [notifications, setNotifications] = useState<ProfileNotification[]>([]);
  const [recommendations, setRecommendations] = useState<ItemPreview[]>([]);

  const updateTasks = async () => {
    if (currentUser) {
      const tasks = await fetchProfileTaskHistory(currentUser.accessToken);
      setTaskHistory([...tasks]);
    }
  };

  const updateRecommendations = async () => {
    if (currentUser) {
      const recommendations = await receiveRecommendations(
        currentUser.accessToken
      );
      if (recommendations) {
        setRecommendations([...recommendations]);
      }
    }
  };

  const hideNotification = async (id: string) => {
    if (currentUser) {
      const answer = await sendMarkNotificationAsViewed(
        id,
        currentUser.accessToken
      );
      if (answer) {
        await updateNotifications();
        await updateCurrentUser();
      }
    }
  };

  const updateNotifications = async () => {
    if (currentUser) {
      const notifications = await getUserNotifications(currentUser.accessToken);

      if (notifications) {
        setNotifications([...notifications]);
        await updateCurrentUser();
      }
    }
  };

  useEffect(() => {
    const wrapper = async () => {
      if (currentUser) {
        await Promise.allSettled([
          updateRecommendations(),
          updateTasks(),
          updateNotifications(),
          updateCurrentUser(),
        ]);
      }
    };

    wrapper();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateNotifications();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (!currentUser) {
    return <Navigate to="/signin" replace></Navigate>;
  }

  const handleFileUploading = async (file: File) => {
    if (!file.type.includes('image')) {
      // show error message
      toast.error('Selected file is not an image', { position: 'top-center' });
    } else {
      // action to upload profile picture
      const imageHash = (await getBase64FromFile(file)) as string;
      setCurrentImageUrl(imageHash);
      await updateProfileImage(currentUser.accessToken, imageHash);
      await updateCurrentUser();
    }
  };

  const friendlist = intersectTwoArrays(
    JSON.parse(currentUser.subscribers),
    JSON.parse(currentUser.subscriptions)
  );

  return (
    <div className="profile-page-wrapper">
      <div className="profile-info">
        <div className="profile-page-picture">
          <div className="picture-container">
            <img src={currentImageUrl} alt=""></img>
          </div>
          <div className="change-profile-picture">
            <FileUploader
              showFileName={false}
              buttonText="Change profile picture"
              handleFile={handleFileUploading}
            ></FileUploader>
          </div>
        </div>
        <div className="profile-page-stats">
          Welcome back, <span>{currentUser.username}</span> <br></br>
          Nodes saved by you: <span>{currentUser.nodesCount}</span> <br></br>
          Relationships saved by you:{' '}
          <span>{currentUser.relationshipsCount}</span>
        </div>

        {notifications.length > 0 && (
          <div className="profile-notifications">
            <div className="notifications-header">Pending notifications</div>
            <div className="notifications">
              {notifications
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
                .map((notification, index) => {
                  return (
                    <div key={index} className="notification">
                      <div className="text">
                        <span
                          onClick={() =>
                            router(`/profile/${notification.actorUsername}`)
                          }
                        >
                          {notification.actorUsername}
                        </span>{' '}
                        {notification.state} to you...
                      </div>
                      <div
                        className="mark"
                        onClick={() => hideNotification(notification.id)}
                      >
                        hide
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        {friendlist.length > 0 && (
          <div className="friend-list">
            <div className="friend-list-header">Your friends</div>
            <div className="friends">
              {friendlist.map((friend, index) => {
                return (
                  <div
                    key={index}
                    className="friend"
                    onClick={() => router(`/profile/${friend}`)}
                  >
                    {friend}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="profile-page-content">
        <div className="profile-page-tasks-contents">
          <div className="profile-page-tasks-history">
            <div className="task-history-wrapper">
              {taskHistory.length !== 0 ? (
                <>
                  <div className="tasks-header">All tasks history</div>
                  <div className="tasks-container">
                    {taskHistory.map((task, index) => (
                      <TaskHistoryItem
                        item={task}
                        key={index}
                      ></TaskHistoryItem>
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-tasks-message">No records yet</div>
              )}
            </div>
          </div>
          <div className="profile-page-tasks">
            <div className="dashboard-wrapper">
              {tasksState.length !== 0 ? (
                <>
                  <div className="tasks-header">This sessions tasks:</div>
                  <div className="dashboard-map-container">
                    {tasksState.map((task, index) => {
                      return (
                        <SingleTaskState
                          key={index}
                          task={task}
                        ></SingleTaskState>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="no-tasks-message">
                  No tasks in current session
                </div>
              )}
            </div>
          </div>
        </div>

        {recommendations.length !== 0 && (
          <div className="profile-recommendations">
            <ViewPanelContainer
              title="According to your taste you would like:"
              items={recommendations}
              containerClassName="profile-recommendations"
            ></ViewPanelContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
