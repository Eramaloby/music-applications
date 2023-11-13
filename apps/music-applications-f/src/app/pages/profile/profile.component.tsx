import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/user.context';
import { Navigate } from 'react-router-dom';

import './profile.styles.scss';
import { FulfilledTask, ItemPreview, User } from '../../types';
import FileUploader from '../../components/file-uploader/file-uploader.component';
import { getBase64FromFile } from '../../utils';
import {
  fetchProfileTaskHistory,
  receiveRecommendations,
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

const Profile = () => {
  // const [pageState, setPageState] = useState<ProfilePageStates>(
  //   ProfilePageStates.DEFAULT
  // );

  // const switchToDefaultView = () => {
  //   setPageState(ProfilePageStates.DEFAULT);
  // };

  const { currentUser } = useContext(UserContext);
  const { tasks } = useContext(TaskContext);

  const [currentImageUrl, setCurrentImageUrl] = useState<string>(
    currentUser?.profileImageBase64 ?? ''
  );
  const [tasksState, setTasksState] = useState<AsyncNeo4jTaskMetadata[]>(tasks);
  const [taskHistory, setTaskHistory] = useState<FulfilledTask[]>([]);
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

  useEffect(() => {
    const wrapper = async () => {
      if (currentUser) {
        await Promise.allSettled([updateRecommendations(), updateTasks()]);
      }
    };

    wrapper();
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
    }
  };

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
      </div>

      <div className="profile-page-content">
        <div className="profile-page-tasks-contents">
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
        </div>

        {recommendations.length !== 0 && (
          <div className="profile-recommendations">
            <ViewPanelContainer
              title="According to your taste you would like:"
              items={recommendations}
              containerClassName='profile-recommendations'
            ></ViewPanelContainer>
          </div>
        )}
      </div>

      {/* <div className="profile-page-action-panel">
        <div
          className="export-saved-records-btn btn"
        >
          You
        </div> */}
      {/* <div className="export-saved-records-btn btn">Export saved items</div>
        <div
          className="search-saved-records-btn btn"
          onClick={() => setPageState(ProfilePageStates.SEARCH_SAVED_ITEMS)}
        >
          Search saved items
        </div> */}
      {/* <div
          className="view-liked-records-btn btn"
          onClick={() => setPageState(ProfilePageStates.LIKED_ITEMS)}
        >
          View liked items
        </div>
        <div
          className="add-new-item-btn btn"
          onClick={() => setPageState(ProfilePageStates.ADD_NEW_ITEM)}
        >
          Add new instance to database
        </div>
        <div
          className="change-password-btn btn"
          onClick={() => setPageState(ProfilePageStates.RESET_PASSWORD)}
        >
          Change Password
        </div>
        <div className="sign-out-btn btn" onClick={() => signOutHandler()}>
          Sign out
        </div>
      </div> */}
      {/* {pageState === ProfilePageStates.DEFAULT && (
        <ProfileInfoComponent user={currentUser as User}></ProfileInfoComponent>
      )}
      {pageState === ProfilePageStates.LIKED_ITEMS && (
        <ViewLikedItemsComponent></ViewLikedItemsComponent>
      )}
      {pageState === ProfilePageStates.RESET_PASSWORD && (
        <ChangePasswordPage></ChangePasswordPage>
      )}
      {pageState === ProfilePageStates.SEARCH_SAVED_ITEMS && (
        <SearchSavedItemsComponent></SearchSavedItemsComponent>
      )}
      {pageState === ProfilePageStates.ADD_NEW_ITEM && (
        <AddItemPage navigateBack={switchToDefaultView}></AddItemPage>
      )} */}
    </div>
  );
};

export default Profile;
