import React, { useContext } from 'react';
import { UserContext } from '../../contexts/user.context';
import { useNavigate } from 'react-router-dom';

import './profile.styles.scss';

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const router = useNavigate();

  const signOut = () => {
    setCurrentUser(null);
    router(-1);
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-page-action-panel">
        <div className="export-saved-records-btn btn">Export saved records</div>
        <div className="search-saved-records-btn btn">Search saved records</div>
        <div className="change-password-btn btn">Change Password</div>
        <div className="sign-out-btn btn" onClick={() => signOut()}>
          Sign out
        </div>
      </div>
      <div className="profile-page-content">
        <div className="profile-information-panel">
          <div className="greeting-message">
            Welcome, {currentUser?.username}{' '}
          </div>
          <div className="user-stats">
            <div className="stats-relation">
              Count of relations saved by you: 152
            </div>
            <div className="stats-instances">
              Count of nodes saved by you: 502
            </div>
          </div>
        </div>
        <div className="recommendation-panel">
          <div className="recommendation-title">
            According to your taste, you would like:
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
