import { GenreWithRelationships } from '../../../../types';
import React from 'react';
import './styles.scss';
import { PropertyDisplay } from './property';
import { RelationshipInterpretation } from './relationship';
import {
  convertAlbumProperties,
  convertArtistProperties,
  convertPlaylistProperties,
} from './utils';
import { useNavigate } from 'react-router-dom';

const GenreItemRelationView = ({
  item,
  navigateTo,
}: {
  item: GenreWithRelationships;
  navigateTo: (type: string, id: string) => void;
}) => {
  // iam lazy
  const router = useNavigate();
  const displayedProperties = Object.entries({
    Name: item.properties.name,
    'About genre': item.properties.description,
    'Count of likes': String(item.properties.likes.low),
  });

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
            <PropertyDisplay label={label} value={value} key={index}></PropertyDisplay>
          ))}
        </div>
        <div className="added-by-link">
          <p>Added by:</p> <span onClick={() => router(`/profile/${item.properties.added_by}`)}>{item.properties.added_by}</span>
        </div>
      </div>
      <div className="item-relationships-container">
        {item.albums && item.albums.length > 0 && (
          <RelationshipInterpretation
            relationshipTitle="Albums"
            relationships={item.albums.map((p) => convertAlbumProperties(p))}
            onClickCallback={navigateTo}
            key={1}
          ></RelationshipInterpretation>
        )}
        {item.artists && item.artists.length > 0 && (
          <RelationshipInterpretation
            relationshipTitle="Artists"
            relationships={item.artists.map((p) => convertArtistProperties(p))}
            onClickCallback={navigateTo}
            key={2}
          ></RelationshipInterpretation>
        )}
        {item.playlists && item.playlists.length > 0 && (
          <RelationshipInterpretation
            relationshipTitle="Playlists"
            relationships={item.playlists.map((p) =>
              convertPlaylistProperties(p)
            )}
            onClickCallback={navigateTo}
            key={3}
          ></RelationshipInterpretation>
        )}
      </div>
    </>
  );
};

export default GenreItemRelationView;
