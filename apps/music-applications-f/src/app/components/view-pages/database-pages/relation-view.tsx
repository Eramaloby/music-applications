import { AlbumProperties, Neo4jDbItem, PlaylistProperties, TrackProperties } from '../../../types';

const RelationViewPage = ({ item }: { item: Neo4jDbItem }) => {
  console.log(item);
  const authorToTrackRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'Author' && relation.target.type === 'Track'
  );
  console.log(authorToTrackRelations);
  const authorToArtistRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'Author' && relation.target.type === 'Artist'
  );
  const appearedAtToTrackRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'AppearedAt' && relation.target.type === 'Track'
  );
  const appearedAtToArtistRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'AppearedAt' && relation.target.type === 'Artist'
  );
  const performsInGenreToGenreRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'PerformsInGenre' && relation.target.type === 'Genre'
  );
  const performsInGenreToArtistRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'PerformsInGenre' && relation.target.type === 'Artist'
  );
  const containsToTrackRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'Contains' && relation.target.type === 'Track'
  );
  const containsToAlbumRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'Contains' && relation.target.type === 'Album'
  );
  const containsToPlaylistRelations = item.relations.filter(
    (relation: any) =>
      relation.type === 'Contains' && relation.target.type === 'Playlist'
  );

  return (
    <div className="database-item-page-text">
      <div className="database-item-name-author-text">
        <div className="database-item-name-text">
          {item.properties.name.toUpperCase()}
        </div>
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
              <div>
                {(item.properties as TrackProperties).explicit ? (
                  <div className="database-item-author-description-text">
                    <div className="database-item-explicit">Explicit:</div>{' '}
                    {(item.properties as TrackProperties).explicit ? <div>Yes</div> : <div>No</div>}
                  </div>
                ) : (
                  <div></div>
                )}
                {(item.properties as AlbumProperties).release ? (
                  <div className="database-item-author-description-text">
                    <div className="database-item-release">Release:</div>{' '}
                    {(item.properties as AlbumProperties).release}
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
        <div className="database-item-appearedat-toartist-text">
          {appearedAtToArtistRelations.length > 0 ? (
            <div>
              <div className="database-item-contains-head-text">
                AppearedArtists
              </div>
              {appearedAtToArtistRelations.map(
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

export default RelationViewPage;

const ToRelation = ({ target }: { target: any }) => {
  return (
    <div className="database-item-torelation">{target.properties.name}</div>
  );
};
