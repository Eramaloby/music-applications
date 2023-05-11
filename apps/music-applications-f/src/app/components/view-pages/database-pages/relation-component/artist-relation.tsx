import { Neo4jDbItem } from '../../../../types';
import ToRelation from './to-relation';

const ArtistRelation = ({
  item,
  routingCallback,
}: {
  item: Neo4jDbItem;
  routingCallback: (type: string, id: number) => void;
}) => {
  const authorToTrackRelations = item.relations.filter(
    (relation: { type: string; target: Neo4jDbItem }) =>
      relation.type === 'Author' && relation.target.type === 'Track'
  );

  // const authorToTracks_TrackProperties = item.relations
  //   .filter(
  //     (relation: any) =>
  //       relation.type === 'Author' && relation.target.type === 'Track'
  //   )
  //   .map((obj) => obj.target.properties) as TrackProperties[];

  const performsInGenreToGenreRelations = item.relations.filter(
    (relation: { type: string; target: Neo4jDbItem }) =>
      relation.type === 'PerformsInGenre' && relation.target.type === 'Genre'
  );
  const appearedAtToTrackRelations = item.relations.filter(
    (relation: { type: string; target: Neo4jDbItem }) =>
      relation.type === 'AppearedAt' && relation.target.type === 'Track'
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
      <div className="database-item-description-text">
        <div className="database-item-perfomsingenre-togenre-text">
          {performsInGenreToGenreRelations.length > 0 ? (
            <div>
              <div className="database-item-contains-head-text">Genres</div>
              {performsInGenreToGenreRelations.map(
                (
                  relation: { type: string; target: Neo4jDbItem },
                  index: number
                ) => {
                  return (
                    <ToRelation
                      routingCallback={routingCallback}
                      target={relation.target}
                      key={index}
                    ></ToRelation>
                  );
                }
              )}
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="database-item-coloumn-settings">
          {authorToTrackRelations.length > 0 ? (
            <div>
              <div className="database-item-contains-head-text">Tracks</div>
              <div className="database-item-scroll">
                {authorToTrackRelations.map(
                  (
                    relation: { type: string; target: Neo4jDbItem },
                    index: number
                  ) => {
                    return (
                      <ToRelation
                        routingCallback={routingCallback}
                        target={relation.target}
                        key={index}
                      ></ToRelation>
                    );
                  }
                )}
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="database-item-appearedat-totrack-text">
          {appearedAtToTrackRelations.length > 0 ? (
            <div>
              <div className="database-item-contains-head-text">
                AppearedTracks
              </div>
              {appearedAtToTrackRelations.map(
                (
                  relation: { type: string; target: Neo4jDbItem },
                  index: number
                ) => {
                  return (
                    <ToRelation
                      routingCallback={routingCallback}
                      target={relation.target}
                      key={index}
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
    </div>
  );
};

export default ArtistRelation;
