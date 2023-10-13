import React, { useContext, useEffect, useRef, useState } from 'react';
import { Id, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/user.context';
import { getUserInformation } from '../../requests';

const ForeignProfile = () => {
  const [isDataSettled, setIsDataSettled] = useState<boolean>(false);
  const { currentUser } = useContext(UserContext);
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
              position: toast.POSITION.TOP_CENTER,
              type: 'success',
              isLoading: false,
              autoClose: 100,
            });
          } else {
            toast.update(toastRef.current as Id, {
              render: 'No profile',
              position: toast.POSITION.TOP_CENTER,
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
        <div className="foreign-page-wrapper">
          <div className="foreign-page-title">
            Currently viewing profile of other person in either guest or logged
            mode
          </div>
        </div>
      ) : (
        <div className="foreign-page-wait"></div>
      )}
    </>
  );
};

export default ForeignProfile;
