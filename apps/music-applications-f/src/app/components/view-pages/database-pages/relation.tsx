import {
  AlbumWithRelationships,
  ArtistWithRelationships,
  FetchItemFromNeo4jResult,
  GenreWithRelationships,
  PlaylistWithRelationships,
  TrackWithRelationships,
} from '../../../types';
import AlbumItemRelationView from './relation-components/album-view';
import ArtistItemRelationView from './relation-components/artist-view';
import GenreItemRelationView from './relation-components/genre-view';
import PlaylistItemRelationView from './relation-components/playlist-view';
import TrackItemRelationView from './relation-components/track-view';

const RelationViewPage = ({
  item: wrapper,
  routingCallback,
}: {
  item: FetchItemFromNeo4jResult;
  routingCallback: (type: string, id: number) => void;
}) => {
  return (
    <div className="relation-view-content-wrapper">
      {wrapper.type === 'album' && (
        <AlbumItemRelationView
          navigateTo={routingCallback}
          item={wrapper.item as AlbumWithRelationships}
        ></AlbumItemRelationView>
      )}
      {wrapper.type === 'artist' && (
        <ArtistItemRelationView
          navigateTo={routingCallback}
          item={wrapper.item as ArtistWithRelationships}
        ></ArtistItemRelationView>
      )}
      {wrapper.type === 'track' && (
        <TrackItemRelationView
          navigateTo={routingCallback}
          item={wrapper.item as TrackWithRelationships}
        ></TrackItemRelationView>
      )}
      {wrapper.type === 'playlist' && (
        <PlaylistItemRelationView
          navigateTo={routingCallback}
          item={wrapper.item as PlaylistWithRelationships}
        ></PlaylistItemRelationView>
      )}
      {wrapper.type === 'genre' && (
        <GenreItemRelationView
          navigateTo={routingCallback}
          item={wrapper.item as GenreWithRelationships}
        ></GenreItemRelationView>
      )}
    </div>
  );
};

export default RelationViewPage;
