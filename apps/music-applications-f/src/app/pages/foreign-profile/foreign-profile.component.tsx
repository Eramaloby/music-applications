import React, { useContext, useEffect, useRef, useState } from 'react';
import { Id, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/user.context';
import { GetUserInformationResponse, getUserInformation } from '../../requests';
import './foreign-profile.styles.scss';

const ForeignProfile = () => {
  const [isDataSettled, setIsDataSettled] = useState<boolean>(false);
  const { currentUser } = useContext(UserContext);

  const [userInfo, setUserInfo] = useState<GetUserInformationResponse | null>(
    null
  );
  const toastRef = useRef<Id | null>(null);

  const params = useParams();
  const router = useNavigate();

  useEffect(() => {
    if (!isDataSettled) {
      const username = params['username'] as string;
      if (currentUser && username === currentUser.username) {
        router('/profile');
      } else {
        toastRef.current = toast.loading('Loading...', {
          toastId: 'id',
          position: toast.POSITION.TOP_CENTER,
          style: { margin: '90px' },
        });

        getUserInformation(username).then((value) => {
          if (value.exists) {
            toast.update(toastRef.current as Id, {
              render: 'Its cool',
              position: 'top-center',
              type: 'success',
              isLoading: false,
              autoClose: 100,
            });

            setUserInfo(value);
          } else {
            toast.update(toastRef.current as Id, {
              render: 'No profile',
              position: 'top-center',
              type: 'warning',
              isLoading: false,
              autoClose: 100,
            });
          }

          setIsDataSettled(true);
        });
      }
    }
  }, []);

  // not authorized => no actions
  // user is viewing his own page => redirect to profile page(or restrict actions)
  // no available user => error page

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {isDataSettled ? (
        userInfo ? (
          <div className="profile-wrapper">
            <div className="profile-summary">
              <div className="profile-user-info">
                <div className="profile-name">{userInfo?.username}</div>
                <div className="profile-picture-container">IMAGE</div>
                <div className="profile-stats">
                  Count of nodes added by user:{' '}
                  <span>{userInfo.nodesCount}</span>
                </div>
                <div className="profile-stats">
                  Count of relationships added by user:{' '}
                  <span>{userInfo.relationshipsCount}</span>
                </div>
              </div>
              <div className="profile-actions">
                <div className="follow-unfollow-button">Follow \ unfollow</div>
              </div>
            </div>
            <div className="profile-records">
              <div className="liked-records-container">Container for likes</div>
              <div className="added-records-container">
                Container for records
              </div>
            </div>
          </div>
        ) : (
          <div className="profile-no-profile-msg">Non existing profile</div>
        )
      ) : (
        <div className="profile-wait"></div>
      )}
    </>
  );
};

export default ForeignProfile;
