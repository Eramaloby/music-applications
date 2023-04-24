import { Navigate } from 'react-router-dom';
import { User } from '../../../types';
import './profile-info.styles.scss';

import React from 'react';

const ProfileInfoComponent = ({ user }: { user: User }) => {
  if (!user) {
    return <Navigate to="/signin" replace></Navigate>;
  }

  return (
    <div className="profile-page-content">
      <div className="profile-information-panel">
        <div className="greeting-message">Welcome, {user.username} </div>
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
  );
};

export default ProfileInfoComponent;
