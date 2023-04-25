import { AlbumProperties, GenreProperties, Neo4jDbItem, PlaylistProperties, TrackProperties } from "../../../../types";

const PlaylistRelation = ({ item }: { item: Neo4jDbItem }) => {
  const containsToTrackRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'Contains' && relation.target.type === 'Track'
  );
  const containsToAlbumRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'Contains' && relation.target.type === 'Album'
  );
  return (
    <div className="database-item-page-text">
      <div className="database-item-name-author-text">
        <div className="database-item-name-text">
          {item.properties.name.toUpperCase()}
        </div>
        <div className="database-item-by">Added by:{' '}</div>
        <div>{item.properties.added_by}</div>
        <div>
          <div className="database-item-author-toartist-relation">
            {item.type === 'Playlist' ? (
              <div className="database-item-author-description-text">
                <div className="database-item-by">Owner-name:</div>
                {(item.properties as PlaylistProperties).owner_name}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
      <div className="database-item-description-text">
        <div className="database-item-contains-totrack-text">
            {containsToTrackRelations.length > 0 ? (
              <div>
                <div className="database-item-contains-head-text">Tracks</div>
                <div className="database-item-scroll">
                  {containsToTrackRelations.map(
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
              </div>
            ) : (
              <div></div>
            )}
          </div>
        <div className="database-item-contains-toalbum-text">
          {containsToAlbumRelations.length > 0 ? (
            <div>
              <div className="database-item-contains-head-text">Albums</div>
              {containsToAlbumRelations.map((relation: any, index: number) => {
                return (
                  <ToRelation target={relation.target} key={index}></ToRelation>
                );
              })}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistRelation;

const ToRelation = ({ target }: { target: any }) => {
  return (
    <div className="database-item-torelation">{target.properties.name}</div>
  );
};