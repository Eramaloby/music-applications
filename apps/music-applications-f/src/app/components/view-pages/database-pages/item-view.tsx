import { useContext, useEffect, useState } from 'react';
import GraphViewPage from './graph-view';
import './style.scss';
import { Neo4jDbItem } from '../../../types';
import RelationViewPage from './relation';
import { ReactComponent as FilledHeart } from '../../../../assets/filled-heart.svg';
import { ReactComponent as Heart } from '../../../../assets/heart.svg';
import axios from 'axios';
import { UserContext } from '../../../contexts/user.context';

const DatabaseItemPage = ({
  item,
  routingCallback,
}: {
  item: Neo4jDbItem;
  routingCallback: (type: string, name: string) => void;
}) => {
  // default view is relation view
  const [isRelationViewSelected, setIsRelationViewSelected] = useState(true);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const { currentUser } = useContext(UserContext);

  // extract to different file later
  const handleLikeChanges = async (newState: boolean) => {
    if (currentUser && item) {
      if (newState) {
        await axios.post(
          `http://localhost:4200/api/like/db`,
          { nodeId: item.properties.id },
          {
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`,
            },
          }
        );
      } else {
        await axios.delete(`http://localhost:4200/api/like/db`, {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
          params: { nodeId: item.properties.id },
        });
      }
      // after awaiting
      setIsLiked(newState);
    }
  };

  useEffect(() => {
    const asyncWrapper = async () => {
      if (currentUser) {
        if (currentUser) {
          const result = await axios.get(
            `http://localhost:4200/api/like/db?nodeId=${item.properties.id}`,
            {
              headers: {
                Authorization: `Bearer ${currentUser.accessToken}`,
              },
            }
          );

          if (result.data) {
            setIsLiked(true);
          } else {
            setIsLiked(false);
          }
        } else {
          setIsLiked(null);
        }
      }
    };

    asyncWrapper();
  }, [currentUser, item]);

  return (
    <div className="database-item-page-wrapper">
      <div className="database-item-page-sidebar-menu">
        <div
          className="database-item-page-menu"
          onClick={() => setIsRelationViewSelected(true)}
        >
          Relation view
        </div>
        <div
          className="database-item-page-menu"
          onClick={() => setIsRelationViewSelected(false)}
        >
          Graph view
        </div>
        {isLiked !== null && (
          <div className="like-container">
            {isLiked !== null && isLiked ? (
              <FilledHeart
                className="heart-icon"
                onClick={() => handleLikeChanges(!isLiked)}
              ></FilledHeart>
            ) : (
              <Heart
                className="heart-icon"
                onClick={() => handleLikeChanges(!isLiked)}
              ></Heart>
            )}
          </div>
        )}
      </div>
      <div className="database-item-page-content">
        {isRelationViewSelected ? (
          <RelationViewPage
            item={item}
            routingCallback={routingCallback}
          ></RelationViewPage>
        ) : (
          // <RelationViewPage item={item}></RelationViewPage>
          <GraphViewPage item={item}></GraphViewPage>
        )}
      </div>
    </div>
  );
};

export default DatabaseItemPage;
