import { useContext, useState } from 'react';
import {
  AlbumWithRelationships,
  ArtistWithRelationships,
  FetchItemFromNeo4jResult,
  GenreProperties,
  GenreWithRelationships,
  Neo4jModel,
  PlaylistProperties,
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
import { deleteItemFromNeo4j, updateNeo4jItem } from '../../../requests';
import { UserContext } from '../../../contexts/user.context';
import { useNavigate } from 'react-router-dom';
import GenreForm from '../../../pages/add-item-page/forms/genre-form/genre-form.component';
import PlaylistForm from '../../../pages/add-item-page/forms/playlist-form/playlist-form.component';
import TrackForm from '../../../pages/add-item-page/forms/track-form/track-form.component';
import ArtistForm from '../../../pages/add-item-page/forms/artist-form/artist-form.component';
import AlbumForm from '../../../pages/add-item-page/forms/album-form/album-form.component';

const RelationViewPage = ({
  item: wrapper,
  routingCallback,
}: {
  item: FetchItemFromNeo4jResult;
  routingCallback: (type: string, id: string) => void;
}) => {
  const [deleteModal, setDeleteModal] = useState(false);

  const [editModal, setEditModal] = useState(false);

  const { currentUser } = useContext(UserContext);
  const router = useNavigate();

  const onDeleteItem = async () => {
    if (!currentUser) {
      setDeleteModal(false);
      return;
    }

    const result = await deleteItemFromNeo4j(
      wrapper.item.properties.id,
      currentUser.accessToken
    );
    if (result) {
      toast.info(`Record was deleted successfully`, { position: 'top-center' });
      router('/search');
    }
  };

  const onUpdate = async (model: Neo4jModel, type: 'album' | 'playlist' | 'track' | 'genre' | 'artist') => {
    if(!currentUser) {
      setEditModal(false);
      return;
    }

    const id = wrapper.item.properties.id;

    const result = await updateNeo4jItem(type, model, id, currentUser.accessToken);
    if (result) {
      toast.info(`Record was updated`, { position: 'top-center' });
    } else {
      toast.info(`Record was not updated`, { position: 'top-center' });
    }

    setEditModal(false);
  };

  return (
    <div className="relation-view-content-wrapper">
      {wrapper.type === 'album' && (
        <AlbumItemRelationView
          onDelete={() => setDeleteModal(true)}
          onUpdate={() => setEditModal(true)}
          navigateTo={routingCallback}
          item={wrapper.item as AlbumWithRelationships}
        ></AlbumItemRelationView>
      )}
      {wrapper.type === 'artist' && (
        <ArtistItemRelationView
          onDelete={() => setDeleteModal(true)}
          onUpdate={() => setEditModal(true)}
          navigateTo={routingCallback}
          item={wrapper.item as ArtistWithRelationships}
        ></ArtistItemRelationView>
      )}
      {wrapper.type === 'track' && (
        <TrackItemRelationView
          onDelete={() => setDeleteModal(true)}
          onUpdate={() => setEditModal(true)}
          navigateTo={routingCallback}
          item={wrapper.item as TrackWithRelationships}
        ></TrackItemRelationView>
      )}
      {wrapper.type === 'playlist' && (
        <PlaylistItemRelationView
          onDelete={() => setDeleteModal(true)}
          onUpdate={() => setEditModal(true)}
          navigateTo={routingCallback}
          item={wrapper.item as PlaylistWithRelationships}
        ></PlaylistItemRelationView>
      )}
      {wrapper.type === 'genre' && (
        <GenreItemRelationView
          onUpdate={() => setEditModal(true)}
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
            <button
              type="button"
              className="confirmation-btn"
              onClick={onDeleteItem}
            >
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
      <AppModal
        visible={editModal}
        setVisible={setEditModal}
        isHiddenOnClick={true}
      >
        <div className="wrapper-form">
          {wrapper.type === 'genre' && (
            <GenreForm
              requestCallback={onUpdate}
              initValues={{
                name: (wrapper.item as GenreWithRelationships).properties.name,
                description: (wrapper.item as GenreWithRelationships).properties
                  .description,
                image: (wrapper.item as GenreWithRelationships).properties
                  .description,
              }}
            ></GenreForm>
          )}
          {wrapper.type === 'playlist' && (
            <PlaylistForm
              requestCallback={onUpdate}
              initValues={{
                name: (wrapper.item as PlaylistWithRelationships).properties
                  .name,
                description: (wrapper.item as PlaylistWithRelationships)
                  .properties.description,
                ownerName: (wrapper.item as PlaylistWithRelationships)
                  .properties.owner_name,
                image: (wrapper.item as PlaylistWithRelationships).properties
                  .image,
                genres: (wrapper.item as PlaylistWithRelationships).genres,
                tracks: (wrapper.item as PlaylistWithRelationships).tracks,
              }}
            ></PlaylistForm>
          )}
          {wrapper.type === 'track' && (
            <TrackForm
              requestCallback={onUpdate}
              initValues={{
                name: (wrapper.item as TrackWithRelationships).properties.name,
                type: (wrapper.item as TrackWithRelationships).properties.type,
                image: (wrapper.item as TrackWithRelationships).properties
                  .image,
                contributors: (wrapper.item as TrackWithRelationships)
                  .contributors,
                author: (wrapper.item as TrackWithRelationships).author,
              }}
            ></TrackForm>
          )}
          {wrapper.type === 'artist' && (
            <ArtistForm
              requestCallback={onUpdate}
              initValues={{
                name: (wrapper.item as ArtistWithRelationships).properties.name,
                type: (wrapper.item as ArtistWithRelationships).properties.type,
                description: (wrapper.item as ArtistWithRelationships)
                  .properties.description,
                image: (wrapper.item as ArtistWithRelationships).properties
                  .image,
                genres: (wrapper.item as ArtistWithRelationships).genres,
              }}
            ></ArtistForm>
          )}
          {wrapper.type === 'album' && (
            <AlbumForm
              requestCallback={onUpdate}
              initValues={{
                name: (wrapper.item as AlbumWithRelationships).properties.name,
                type: (wrapper.item as AlbumWithRelationships).properties.type,
                countOfTracks: (wrapper.item as AlbumWithRelationships)
                  .properties.count_of_tracks,
                label: (wrapper.item as AlbumWithRelationships).properties
                  .label,
                releaseDate: (wrapper.item as AlbumWithRelationships).properties
                  .release_date,
                image: (wrapper.item as AlbumWithRelationships).properties
                  .image,
                relatedGenres: (wrapper.item as AlbumWithRelationships).genres,
                author: (wrapper.item as AlbumWithRelationships).author,
                contributors: (wrapper.item as AlbumWithRelationships)
                  .contributors,
                tracks: (wrapper.item as AlbumWithRelationships).tracks,
              }}
            ></AlbumForm>
          )}
        </div>
      </AppModal>
    </div>
  );
};

export default RelationViewPage;
