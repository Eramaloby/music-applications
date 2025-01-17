import { ItemPreview } from '../../../types';
import './view-liked-items.styles.scss';

import React, { useContext, useEffect, useState } from 'react';
import { getAllUserLikes } from '../../../requests';
import { UserContext } from '../../../contexts/user.context';
import ViewPanelContainer from '../../recently-viewed-panel/view-panel-container';

const ViewLikedItemsComponent = () => {
  const [likes, setLikes] = useState<ItemPreview[]>([]);
  const { currentUser } = useContext(UserContext);

  const fetchUserLikes = async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = await getAllUserLikes(currentUser!.accessToken);
    if (result) {
      setLikes([...result]);
    }
  };

  useEffect(() => {
    const asyncWrapper = async () => {
      await fetchUserLikes();
    }
    asyncWrapper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return likes.length !== 0 ? (
    <div className="liked-panel">
      <ViewPanelContainer
        title="Items that your liked"
        items={likes}
        containerClassName="liked-panel"
      ></ViewPanelContainer>
    </div>
  ) : (
    <div className='no-likes-message'>No items liked</div>
  );
};

export default ViewLikedItemsComponent;
