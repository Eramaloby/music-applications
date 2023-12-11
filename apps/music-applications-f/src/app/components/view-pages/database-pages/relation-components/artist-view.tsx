import { ArtistWithRelationships } from '../../../../types';
import React, { useContext } from 'react';
import './styles.scss';
import { PropertyDisplay } from './property';
import {
  convertAlbumProperties,
  convertGenreProperties,
  convertTrackProperties,
} from './utils';
import { RelationshipInterpretation } from './relationship';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { UserContext } from 'apps/music-applications-f/src/app/contexts/user.context';

const ArtistItemRelationView = ({
  item,
  navigateTo,
  onDelete,
  onUpdate,
}: {
  item: ArtistWithRelationships;
  navigateTo: (type: string, id: string) => void;
  onDelete: () => void;
  onUpdate: () => void;
}) => {
  // iam lazy
  const router = useNavigate();
  const displayedProperties = Object.entries({
    Name: String(item.properties.name),
    'About artist': item.properties.description,
    'Artist type': item.properties.type,
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
          {displayedProperties.map(([label, value], index) => (
            <PropertyDisplay
              label={label}
              value={value}
              key={index}
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
            relationshipTitle="Artist genres"
            relationships={item.genres.map((p) => convertGenreProperties(p))}
            onClickCallback={navigateTo}
            key={1}
          ></RelationshipInterpretation>
        )}
        {item.albumAuthor && item.albumAuthor.length > 0 && (
          <RelationshipInterpretation
            relationshipTitle="Albums author"
            relationships={item.albumAuthor.map((p) =>
              convertAlbumProperties(p)
            )}
            onClickCallback={navigateTo}
            key={2}
          ></RelationshipInterpretation>
        )}
        {item.albumContributor && item.albumContributor.length > 0 && (
          <RelationshipInterpretation
            relationshipTitle="Albums contributed"
            relationships={item.albumContributor.map((p) =>
              convertAlbumProperties(p)
            )}
            onClickCallback={navigateTo}
            key={3}
          ></RelationshipInterpretation>
        )}
        {item.tracksAuthor && item.tracksAuthor.length > 0 && (
          <RelationshipInterpretation
            relationshipTitle="Tracks author"
            relationships={item.tracksAuthor.map((p) =>
              convertTrackProperties(p)
            )}
            onClickCallback={navigateTo}
            key={4}
          ></RelationshipInterpretation>
        )}
        {item.tracksContributor && item.tracksContributor.length > 0 && (
          <RelationshipInterpretation
            relationshipTitle="Tracks contributed"
            relationships={item.tracksContributor.map((p) =>
              convertTrackProperties(p)
            )}
            onClickCallback={navigateTo}
            key={5}
          ></RelationshipInterpretation>
        )}
      </div>
    </>
  );
};

export default ArtistItemRelationView;
