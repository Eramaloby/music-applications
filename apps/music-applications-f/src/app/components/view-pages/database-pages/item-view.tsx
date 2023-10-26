import { useContext, useEffect, useState } from 'react';
import GraphViewPage from './graph-view';
import './style.scss';

import RelationViewPage from './relation';
import { ReactComponent as FilledHeart } from '../../../../assets/filled-heart.svg';
import { ReactComponent as Heart } from '../../../../assets/heart.svg';
import { UserContext } from '../../../contexts/user.context';
import {
  checkIfLiked,
  dropLike,
  fetchDatabaseItem,
  pressLike,
} from '../../../requests';
import { useNavigate, useParams } from 'react-router-dom';
import { RecentlyViewedContext } from '../../../contexts/recently-viewed.context';
import { FetchItemFromNeo4jResult } from '../../../types';

const DatabaseItemPage = () => {
  // default view is relation view
  const params = useParams();
  const router = useNavigate();

  const [neo4jItem, setNeo4jItem] = useState<FetchItemFromNeo4jResult | null>(
    null
  );

  const [isRelationViewSelected, setIsRelationViewSelected] = useState(true);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const { currentUser } = useContext(UserContext);
  const { addItem } = useContext(RecentlyViewedContext);

  const [fetchedError, setFetchedError] = useState('');

  // extract to different file later
  const handleLikeChanges = async (newState: boolean) => {
    if (currentUser && neo4jItem) {
      if (newState) {
        await pressLike(neo4jItem.item.properties.id, currentUser.accessToken);
      } else {
        await dropLike(neo4jItem.item.properties.id, currentUser.accessToken);
      }
      // after awaiting
      setIsLiked(newState);
    }
  };

  const routingCallback = (type: string, id: number) =>
    router(`/db/${type}/${id}`);

  useEffect(() => {
    const asyncWrapper = async () => {
      if ((params['id'], params['type'])) {
        const id = params['id'] as unknown as number;
        const type = params['type'] as unknown as string;
        const fetchResult = await fetchDatabaseItem(id, type);

        if (fetchResult) {
          setNeo4jItem({ ...fetchResult });
          // TODO: GENERATE IMAGES FOR GENRE
          addItem({
            type: type,
            label: fetchResult.item.properties.name,
            databaseId: fetchResult.item.properties.id,
            // image: fetchedItem.properties.image_url
          });
        } else {
          setFetchedError('Item not found');
        }
      }
    };

    asyncWrapper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params['id'], params['type']]);

  useEffect(() => {
    const asyncWrapper = async () => {
      if (currentUser && neo4jItem) {
        if (currentUser) {
          const result = await checkIfLiked(
            neo4jItem.item.properties.id,
            currentUser.accessToken
          );

          setIsLiked(result);
        } else {
          setIsLiked(null);
        }
      }
    };

    asyncWrapper();
  }, [currentUser, neo4jItem]);

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
      {neo4jItem && (
        <div className="database-item-page-content">
          {isRelationViewSelected ? (
            <RelationViewPage
              item={neo4jItem}
              routingCallback={routingCallback}
            ></RelationViewPage>
          ) : (
            <GraphViewPage item={neo4jItem.item}></GraphViewPage>
          )}
        </div>
      )}
      {/* TODO: add proper error handling */}
      {fetchedError && (
        <div className="fetched-error-message">{fetchedError}</div>
      )}
    </div>
  );
};

export default DatabaseItemPage;
