import React, { useContext, useEffect, useRef, useState } from 'react';
import { Id, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/user.context';
import {
  GetUserInformationResponse,
  getUserInformation,
  sendSubscribeToUser,
  sendUnsubscribeToUser,
} from '../../requests';
import './foreign-profile.styles.scss';
import ViewPanelContainer from '../../components/recently-viewed-panel/view-panel-container';

const ForeignProfile = () => {
  const [isDataSettled, setIsDataSettled] = useState<boolean>(false);
  const { currentUser } = useContext(UserContext);
  const [isSubbed, setIsSubbed] = useState(false);

  const [userInfo, setUserInfo] = useState<GetUserInformationResponse | null>(
    null
  );
  const toastRef = useRef<Id | null>(null);

  const params = useParams();
  const router = useNavigate();

  const subscribeToUser = async () => {
    if (userInfo && currentUser) {
      const answer = await sendSubscribeToUser(
        userInfo.username,
        currentUser.accessToken
      );
      if (answer) {
        setIsSubbed(true);
      }
    }
  };

  const unsubscribeFromUser = async () => {
    if (userInfo && currentUser) {
      const answer = await sendUnsubscribeToUser(
        userInfo.username,
        currentUser.accessToken
      );

      if (answer) {
        setIsSubbed(false);
      }
    }
  };

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
              render: 'ready...',
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

          currentUser &&
            setIsSubbed(value.subscribers.includes(currentUser.username));

          setIsDataSettled(true);
        });
      }
    }
  }, [currentUser]);

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
                <div className="profile-picture-container">
                  <img src={userInfo.imageBase64} alt=""></img>
                </div>
                <div className="profile-name">{userInfo?.username}</div>
                <div className="profile-stats">
                  Count of nodes added by user:{' '}
                  <span>{userInfo.nodesCount}</span>
                </div>
                <div className="profile-stats">
                  Count of relationships added by user:{' '}
                  <span>{userInfo.relationshipsCount}</span>
                </div>
              </div>
              {currentUser && (
                <div className="profile-actions">
                  {isSubbed ? (
                    <div
                      className="follow-unfollow-button"
                      onClick={unsubscribeFromUser}
                    >
                      Unsubscribe
                    </div>
                  ) : (
                    <div
                      className="follow-unfollow-button"
                      onClick={subscribeToUser}
                    >
                      Subscribe
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="profile-records">
              <div className="liked-records-container">
                <ViewPanelContainer
                  title="User likes"
                  items={userInfo.likes}
                  containerClassName="liked-records-container"
                ></ViewPanelContainer>
              </div>
              <div className="added-records-container">
                <ViewPanelContainer
                  title="User records"
                  items={userInfo.added}
                  containerClassName="added-records-container"
                ></ViewPanelContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="profile-no-profile-msg">
            <div>Whoops...Seems like that profile don't exist anymore..</div>
            <div className="link" onClick={() => router(-1)}>
              Click here to go back
            </div>
          </div>
        )
      ) : (
        <div className="profile-wait"></div>
      )}
    </>
  );
};

export default ForeignProfile;
