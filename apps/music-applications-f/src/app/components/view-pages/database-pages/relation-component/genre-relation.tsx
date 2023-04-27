import { Neo4jDbItem } from "../../../../types";

const GenreRelation = ({ item }: { item: Neo4jDbItem }) => {

  const performsInGenreToArtistRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'PerformsInGenre' && relation.target.type === 'Artist'
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
       <div className="database-item-perfomsingenre-toartist-text">
          {performsInGenreToArtistRelations.length > 0 ? (
            <div>
              <div className="database-item-contains-head-text">Artists</div>
              {performsInGenreToArtistRelations.map(
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
  );
};

export default GenreRelation;

const ToRelation = ({ target }: { target: any }) => {
  return (
    <div className="database-item-torelation">{target.properties.name}</div>
  );
};