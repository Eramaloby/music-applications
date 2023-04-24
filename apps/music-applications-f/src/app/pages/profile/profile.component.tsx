import React, { useContext, useState } from 'react';
import { UserContext } from '../../contexts/user.context';
import { useNavigate } from 'react-router-dom';

import './profile.styles.scss';
import { ProfilePageStates, User } from '../../types';
import ProfileInfoComponent from '../../components/profile/profile-info/profile-info.component';
import ViewLikedItemsComponent from '../../components/profile/view-liked-items/view-liked-items.component';
import ChangePasswordComponent from '../../components/profile/change-password/change-password.component';
import SearchSavedItemsComponent from '../../components/profile/search-saved-items/search-saved-items.component';

const Profile = () => {
  const [pageState, setPageState] = useState<ProfilePageStates>(
    ProfilePageStates.DEFAULT
  );

  const { currentUser, setUser } = useContext(UserContext);
  const router = useNavigate();

  const signOut = () => {
    setUser(null);
    router(-1);
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-page-action-panel">
        <div
          className="export-saved-records-btn btn"
          onClick={() => setPageState(ProfilePageStates.DEFAULT)}
        >
          You
        </div>
        <div
          className="export-saved-records-btn btn"
          onClick={() => console.log('export flow')}
        >
          Export saved items
        </div>
        <div
          className="search-saved-records-btn btn"
          onClick={() => setPageState(ProfilePageStates.SEARCH_SAVED_ITEMS)}
        >
          Search saved items
        </div>
        <div
          className="view-liked-records-btn btn"
          onClick={() => setPageState(ProfilePageStates.LIKED_ITEMS)}
        >
          View liked items
        </div>
        <div
          className="change-password-btn btn"
          onClick={() => setPageState(ProfilePageStates.RESET_PASSWORD)}
        >
          Change Password
        </div>
        <div className="sign-out-btn btn" onClick={() => signOut()}>
          Sign out
        </div>
      </div>
      {pageState === ProfilePageStates.DEFAULT && (
        <ProfileInfoComponent user={currentUser as User}></ProfileInfoComponent>
      )}
      {pageState === ProfilePageStates.LIKED_ITEMS && (
        <ViewLikedItemsComponent></ViewLikedItemsComponent>
      )}
      {pageState === ProfilePageStates.RESET_PASSWORD && (
        <ChangePasswordComponent></ChangePasswordComponent>
      )}
      {pageState === ProfilePageStates.SEARCH_SAVED_ITEMS && (
        <SearchSavedItemsComponent></SearchSavedItemsComponent>
      )}
    </div>
  );
};

export default Profile;
