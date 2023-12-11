import { PlaylistWithRelationships } from '../../../../types';
import React, { useContext } from 'react';
import './styles.scss';
import { PropertyDisplay } from './property';
import { RelationshipInterpretation } from './relationship';
import { convertGenreProperties, convertTrackProperties } from './utils';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { UserContext } from 'apps/music-applications-f/src/app/contexts/user.context';

const PlaylistItemRelationView = ({
  item,
  navigateTo,
  onDelete,
  onUpdate,
}: {
  item: PlaylistWithRelationships;
  navigateTo: (type: string, id: string) => void;
  onDelete: () => void;
  onUpdate: () => void;
}) => {
  const router = useNavigate();
  const displayedProperties = Object.entries({
    Name: item.properties.name,
    'About playlist': item.properties.description,
    'Count of likes': String(item.properties.likes.low),
  });

  const { currentUser } = useContext(UserContext);

  return (
    <>
      <div className="item-properties-container">
        <div className="item-image-container">
          {item.properties.image && item.properties.image !== 'Not provided' ? (
            <img
              src={item.properties.image}
              alt=""
              className="item-image"
            ></img>
          ) : (
            <div className="no-image-provided-container">
              Image is not provided: click to create?
            </div>
          )}
        </div>
        <div className="item-properties">
          {displayedProperties.map(([label, value], key) => (
            <PropertyDisplay
              label={label}
              value={value}
              key={key}
            ></PropertyDisplay>
          ))}
        </div>
        <div className="added-by-link">
          <p>Added by:</p>{' '}
          <span onClick={() => router(`/profile/${item.properties.added_by}`)}>
            {item.properties.added_by}
          </span>
        </div>
        {currentUser && (
          <div className="btns">
            <button className="delete-item" type="button" onClick={onDelete}>
              delete
            </button>
            <button className="edit-item" type="button" onClick={onUpdate}>
              edit
            </button>
          </div>
        )}
      </div>
      <div className="item-relationships-container">
        {item.genres && item.genres.length > 0 && (
          <RelationshipInterpretation
            relationshipTitle="Genres"
            relationships={item.genres.map((p) => convertGenreProperties(p))}
            onClickCallback={navigateTo}
            key={1}
          ></RelationshipInterpretation>
        )}

        {item.tracks && item.tracks.length > 0 && (
          <RelationshipInterpretation
            relationshipTitle="Tracks"
            relationships={item.tracks.map((p) => convertTrackProperties(p))}
            onClickCallback={navigateTo}
            key={2}
          ></RelationshipInterpretation>
        )}
      </div>
    </>
  );
};

export default PlaylistItemRelationView;
