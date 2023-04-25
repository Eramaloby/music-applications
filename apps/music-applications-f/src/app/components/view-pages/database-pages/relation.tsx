import { Neo4jDbItem } from '../../../types';
import AlbumRelation from './relation-component/album-relation';
import ArtistRelation from './relation-component/artist-relation';
import GenreRelation from './relation-component/genre-relation';
import PlaylistRelation from './relation-component/playlist-relation';
import TrackRelation from './relation-component/track-relation';

const RelationViewPage_2 = ({ item }: { item: Neo4jDbItem }) => {
  console.log(item.properties.id);
  return (
    <div>
      <div>
        {item && (
          <>
            {item.type === 'Genre' && (
              <GenreRelation item={item}></GenreRelation>
            )}
            {item.type === 'Track' && (
              <TrackRelation item={item}></TrackRelation>
            )}
            {item.type === 'Artist' && (
              <ArtistRelation item={item}></ArtistRelation>
            )}
            {item.type === 'Album' && (
              <AlbumRelation item={item}></AlbumRelation>
            )}
            {item.type === 'Playlist' && (
              <PlaylistRelation item={item}></PlaylistRelation>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RelationViewPage_2;
