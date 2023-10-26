import { PlaylistWithRelationships } from '../../../../types';
import React from 'react';
import './styles.scss';
import { PropertyDisplay } from './property';
import { RelationshipInterpretation } from './relationship';
import {
  convertGenreProperties,
  convertTrackProperties,
} from './utils';

const PlaylistItemRelationView = ({
  item,
  navigateTo,
}: {
  item: PlaylistWithRelationships;
  navigateTo: (type: string, id: number) => void;
}) => {
  const displayedProperties = Object.entries({
    Name: item.properties.name,
    'About playlist': item.properties.description,
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
          {displayedProperties.map(([label, value]) => (
            <PropertyDisplay label={label} value={value}></PropertyDisplay>
          ))}
        </div>
      </div>
      <div className="item-relationships-container">
        <RelationshipInterpretation
          relationshipTitle="Genres"
          relationships={item.genres.map((p) => convertGenreProperties(p))}
          onClickCallback={navigateTo}
        ></RelationshipInterpretation>
        <RelationshipInterpretation
          relationshipTitle="Tracks"
          relationships={item.tracks.map((p) => convertTrackProperties(p))}
          onClickCallback={navigateTo}
        ></RelationshipInterpretation>
      </div>
    </>
  );
};

export default PlaylistItemRelationView;
