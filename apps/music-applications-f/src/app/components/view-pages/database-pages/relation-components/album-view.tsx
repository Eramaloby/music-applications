import { AlbumWithRelationships } from '../../../../types';
import React from 'react';
import './styles.scss';
import { PropertyDisplay } from './property';

const AlbumItemRelationView = ({
  item,
  navigateTo,
}: {
  item: AlbumWithRelationships;
  navigateTo: (type: string, id: number) => void;
}) => {
  const displayedProperties = Object.entries({
    Name: String(item.properties.name),
    'Count of tracks at album': String(item.properties.count_of_tracks),
    'Released at': String(item.properties.release_date),
    'Album label': String(item.properties.label),
    Type: String(item.properties.type),
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
      <div className="item-relationships-container"></div>
    </>
  );
};

export default AlbumItemRelationView;
