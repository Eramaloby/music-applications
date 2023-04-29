import { Neo4jDbItem } from '../../../../types';
import ToRelation from './to-relation';

const GenreRelation = ({
  item,
  routingCallback,
}: {
  item: Neo4jDbItem;
  routingCallback: (type: string, name: string) => void;
}) => {
  const performsInGenreToArtistRelations = item.relations.filter(
    (relation: { type: string; target: Neo4jDbItem }) =>
      relation.type === 'PerformsInGenre' && relation.target.type === 'Artist'
  );

  return (
    <div className="database-item-page-text">
      <div className="database-item-name-author-text">
        <div className="database-item-name-text">{item.name.toUpperCase()}</div>
        <div>
          <div className="database-item-by">Added by: </div>
          <div>{item.properties.added_by}</div>
        </div>
      </div>
      <div className="database-item-perfomsingenre-toartist-text">
        {performsInGenreToArtistRelations.length > 0 ? (
          <div>
            <div className="database-item-contains-head-text">Artists</div>
            {performsInGenreToArtistRelations.map(
              (
                relation: { type: string; target: Neo4jDbItem },
                index: number
              ) => {
                return (
                  <ToRelation
                    target={relation.target}
                    key={index}
                    routingCallback={routingCallback}
                  ></ToRelation>
                );
              }
            )}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default GenreRelation;
