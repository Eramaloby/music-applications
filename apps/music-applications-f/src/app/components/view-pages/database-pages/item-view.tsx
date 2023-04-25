import { useState } from 'react';
import RelationViewPage from './relation-view';
import GraphViewPage from './graph-view';
import './style.scss';
import { Neo4jDbItem } from '../../../types';
import RelationViewPage_2 from './relation';

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
          <RelationViewPage_2 item={item}></RelationViewPage_2>
          // <RelationViewPage item={item}></RelationViewPage>
        ) : (
          <GraphViewPage item={item}></GraphViewPage>
        )}
      </div>
    </div>
  );
};

export default DatabaseItemPage;
