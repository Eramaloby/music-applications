import { Neo4jDbItem } from '../../../types';
import AlbumRelation from './relation-component/album-relation';
import ArtistRelation from './relation-component/artist-relation';
import GenreRelation from './relation-component/genre-relation';
import PlaylistRelation from './relation-component/playlist-relation';
import TrackRelation from './relation-component/track-relation';

const RelationViewPage = ({
  item,
  routingCallback,
}: {
  item: Neo4jDbItem;
  routingCallback: (type: string, name: string) => void;
}) => {
  console.log(item);
  return (
    <div>
      <div>
        {item && (
          <>
            {item.type === 'Genre' && (
              <GenreRelation
                item={item}
                routingCallback={routingCallback}
              ></GenreRelation>
            )}
            {item.type === 'Track' && (
              <TrackRelation
                item={item}
                routingCallback={routingCallback}
              ></TrackRelation>
            )}
            {item.type === 'Artist' && (
              <ArtistRelation
                item={item}
                routingCallback={routingCallback}
              ></ArtistRelation>
            )}
            {item.type === 'Album' && (
              <AlbumRelation
                item={item}
                routingCallback={routingCallback}
              ></AlbumRelation>
            )}
            {item.type === 'Playlist' && (
              <PlaylistRelation
                item={item}
                routingCallback={routingCallback}
              ></PlaylistRelation>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RelationViewPage;
