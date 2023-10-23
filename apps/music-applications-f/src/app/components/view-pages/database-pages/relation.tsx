import {
  AlbumWithRelationships,
  ArtistWithRelationships,
  GenreProperties,
  Neo4jNodeWithRelationships,
  PlaylistWithRelationships,
  TrackWithRelationships,
} from '../../../types';

const RelationViewPage = ({
  item,
  routingCallback,
}: {
  item: Neo4jNodeWithRelationships;
  routingCallback: (type: string, id: number) => void;
}) => {
  return (
    <div className="relation-view-content-wrapper">
      <div className="wrapper-kirilla-daunova">{JSON.stringify(item)}</div>
    </div>
  );
};

export default RelationViewPage;
