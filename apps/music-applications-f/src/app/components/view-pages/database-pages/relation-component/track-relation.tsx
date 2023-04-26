import { Neo4jDbItem, TrackProperties } from "../../../../types";

const TrackRelation = ({ item }: { item: Neo4jDbItem }) => {
  const containsToAlbumRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'Contains' && relation.target.type === 'Album'
  );
  const containsToPlaylistRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'Contains' && relation.target.type === 'Playlist'
  );
  const authorToArtistRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'Author' && relation.target.type === 'Artist'
  );


  return (
    <div className="database-item-page-text">
      <div className="database-item-name-author-text">
        <div className="database-item-name-text">
          {item.properties.name.toUpperCase()}
        </div>
        <div>
          {authorToArtistRelations.length > 0 ? (
            <div className="database-item-author-toartist-relation">
              <div className="database-item-author-text">
                <div className="database-item-by">By</div>
                {authorToArtistRelations.map((relation: any, index: number) => {
                  return (
                    <ToRelation
                      target={relation.target}
                      key={index}
                    ></ToRelation>
                  );
                })}
              </div>
              <div className="database-item-by">Added by:{' '}</div>
              <div>{item.properties.added_by}</div>
              <div>
                {(item.properties as TrackProperties).explicit ? (
                  <div className="database-item-author-description-text">
                    <div className="database-item-explicit">Explicit:</div>{' '}
                    {(item.properties as TrackProperties).explicit ? <div>Yes</div> : <div>No</div>}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <div className="database-item-description-text">
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
        <div className="database-item-contains-toplaylist-text">
            {containsToPlaylistRelations.length > 0 ? (
              <div className="database-item-scroll">
                <div className="database-item-contains-head-text">Playlists</div>
                {containsToPlaylistRelations.map(
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

export default TrackRelation;

const ToRelation = ({ target }: { target: any }) => {
  return (
    <div className="database-item-torelation">{target.properties.name}</div>
  );
};