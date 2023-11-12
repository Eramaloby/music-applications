import React, { useContext, useState } from 'react';
import { UserContext } from '../../contexts/user.context';
import { Navigate } from 'react-router-dom';

import './profile.styles.scss';
import { User } from '../../types';
import ProfileInfoComponent from '../../components/profile/profile-info/profile-info.component';
import ViewLikedItemsComponent from '../../components/profile/view-liked-items/view-liked-items.component';
import ChangePasswordPage from '../change-password-page/change-password.component';
import SearchSavedItemsComponent from '../../components/profile/search-saved-items/search-saved-items.component';
import AddItemPage from '../add-item-page/add-item-section.component';
import FileUploader from '../../components/file-uploader/file-uploader.component';
import { getBase64FromFile } from '../../utils';
import { updateProfileImage } from '../../requests';
import { toast } from 'react-toastify';

const Profile = () => {
  // const [pageState, setPageState] = useState<ProfilePageStates>(
  //   ProfilePageStates.DEFAULT
  // );

  // const switchToDefaultView = () => {
  //   setPageState(ProfilePageStates.DEFAULT);
  // };

  const { currentUser } = useContext(UserContext);

  const [currentImageUrl, setCurrentImageUrl] = useState<string>(
    currentUser?.profileImageBase64 ?? ''
  );

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
          Nodes saved by you: {currentUser.nodesCount} <br></br>Relationships
          saved by you: {currentUser.relationshipsCount}
        </div>
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
