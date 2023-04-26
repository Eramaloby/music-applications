import { Neo4jDbItem } from "../../../../types";

const ArtistRelation = ({ item }: { item: Neo4jDbItem }) => {
  const authorToTrackRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'Author' && relation.target.type === 'Track'
  );
  const performsInGenreToGenreRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'PerformsInGenre' && relation.target.type === 'Genre'
  );
  const appearedAtToTrackRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'AppearedAt' && relation.target.type === 'Track'
  );  


  return (
    <div className="database-item-page-text">
      <div className="database-item-name-author-text">
        <div className="database-item-name-text">
          {item.properties.name.toUpperCase()}
        </div>
        <div>
          <div className="database-item-by">Added by:{' '}</div>
          <div>{item.properties.added_by}</div>
        </div>
      </div>
      <div className="database-item-description-text">
        <div className="database-item-perfomsingenre-togenre-text">
          {performsInGenreToGenreRelations.length > 0 ? (
            <div>
              <div className="database-item-contains-head-text">Genres</div>
              {performsInGenreToGenreRelations.map(
                (relation: any, index: number) => {
                  return (
                    <ToRelation
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
                {authorToTrackRelations.map((relation: any, index: number) => {
                  return (
                    <ToRelation
                      target={relation.target}
                      key={index}
                    ></ToRelation>
                  );
                })}
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
                (relation: any, index: number) => {
                  return (
                    <ToRelation
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

const ToRelation = ({ target }: { target: any }) => {
  return (
    <div className="database-item-torelation">{target.properties.name}</div>
  );
};