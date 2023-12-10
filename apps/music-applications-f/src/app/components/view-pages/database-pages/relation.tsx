import { useContext, useState } from 'react';
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
import AppModal from '../../ui-elements/modal';
import { toast } from 'react-toastify';
import { deleteItemFromNeo4j } from '../../../requests';
import { UserContext } from '../../../contexts/user.context';
import { useNavigate } from 'react-router-dom';

const RelationViewPage = ({
  item: wrapper,
  routingCallback,
}: {
  item: FetchItemFromNeo4jResult;
  routingCallback: (type: string, id: string) => void;
}) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const { currentUser } = useContext(UserContext);
  const router = useNavigate();

  const onDeleteItem = async () => {
    if (!currentUser) {
      setDeleteModal(false);
      return;
    }

    const result = await deleteItemFromNeo4j(wrapper.item.properties.id, currentUser.accessToken);
    if (result) {
      toast.info(`Record was deleted successfully`, { position: 'top-center' });
      router('/search');
    }
  }
  return (
    <div className="relation-view-content-wrapper">
      {wrapper.type === 'album' && (
        <AlbumItemRelationView
          onDelete={() => setDeleteModal(true)}
          navigateTo={routingCallback}
          item={wrapper.item as AlbumWithRelationships}
        ></AlbumItemRelationView>
      )}
      {wrapper.type === 'artist' && (
        <ArtistItemRelationView
          onDelete={() => setDeleteModal(true)}
          navigateTo={routingCallback}
          item={wrapper.item as ArtistWithRelationships}
        ></ArtistItemRelationView>
      )}
      {wrapper.type === 'track' && (
        <TrackItemRelationView
          onDelete={() => setDeleteModal(true)}
          navigateTo={routingCallback}
          item={wrapper.item as TrackWithRelationships}
        ></TrackItemRelationView>
      )}
      {wrapper.type === 'playlist' && (
        <PlaylistItemRelationView
          onDelete={() => setDeleteModal(true)}
          navigateTo={routingCallback}
          item={wrapper.item as PlaylistWithRelationships}
        ></PlaylistItemRelationView>
      )}
      {wrapper.type === 'genre' && (
        <GenreItemRelationView
          onDelete={() => setDeleteModal(true)}
          navigateTo={routingCallback}
          item={wrapper.item as GenreWithRelationships}
        ></GenreItemRelationView>
      )}
      <AppModal
        visible={deleteModal}
        setVisible={setDeleteModal}
        isHiddenOnClick={true}
      >
        <div className="confirmation">
          <h1 className="message">Are you sure?</h1>
          <div className="buttons">
            <button type="button" className="confirmation-btn" onClick={onDeleteItem}>
              Yes
            </button>
            <button
              type="button"
              className="confirmation-btn cancel"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </AppModal>
    </div>
  );
};

export default RelationViewPage;
