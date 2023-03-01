import { useState } from 'react';
import RelationViewPage from './relation-view';
import './style.scss';
import { Neo4jDbItem } from '../../../types';

const DatabaseItemPage = ({ item }: {item: Neo4jDbItem}) => {
  // default view is relation view
  const [isRelationViewSelected, setIsRelationViewSelected] = useState(true);

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
      </div>
      <div className="database-item-page-content">
        {isRelationViewSelected ? (
          <RelationViewPage item={item}></RelationViewPage>
        ) : (
          <div>NOT IMPLEMENTED YET</div>
        )}
      </div>
    </div>
  );
};

export default DatabaseItemPage;
