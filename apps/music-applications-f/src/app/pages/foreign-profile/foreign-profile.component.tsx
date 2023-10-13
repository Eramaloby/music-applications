import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/user.context';

const ForeignProfile = () => {
  const [isDataSettled, setIsDataSettled] = useState<boolean>(false);
  const { currentUser } = useContext(UserContext);

  const params = useParams();

  useEffect(() => {
    if (!isDataSettled) {
      toast.promise(
        new Promise((resolve, reject) => {
          const fetchDataAsync = async () => {
            console.log('loading data profile');
          };

          if (currentUser && currentUser.username === params['username']) {
            // viewing own page => redirect to profile
            resolve('redirect');
          } else {
            // fetch data
          }
        }),
        {
          loading: 'Loading...',
          success: 'Page is ready!',
          error: 'Something went wrong',
        },
        {
          id: 'toastId',
        }
      );
    }
  }, [params['username']]);

  // not authorized => no actions
  // user is viewing his own page => redirect to profile page(or restrict actions)
  // no available user => error page

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {isDataSettled ? (
        <div className="foreign-page-wrapper">
          <div className="foreign-page-title">Currently viewing profile of</div>
        </div>
      ) : (
        <div>Wait until page is loaded</div>
      )}
    </>
  );
};

export default ForeignProfile;
