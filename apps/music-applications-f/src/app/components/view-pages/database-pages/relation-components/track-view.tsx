import { TrackWithRelationships } from '../../../../types';
import { convertDuration } from '../../../../utils';
import React from 'react';
import './styles.scss';
import { PropertyDisplay } from './property';
import { RelationshipInterpretation } from './relationship';
import { convertAlbumProperties, convertArtistProperties } from './utils';

const TrackItemRelationView = ({
  item,
  navigateTo,
}: {
  item: TrackWithRelationships;
  navigateTo: (type: string, id: number) => void;
}) => {
  const displayedProperties = Object.entries({
    Name: item.properties.name,
    'Duration of track': convertDuration(item.properties.duration_ms),
    'Contains explicit lyrics': item.properties.explicit ? 'Yes' : 'No',
    'Track type': item.properties.type,
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
        {item.author && (
          <RelationshipInterpretation
            relationshipTitle="Author"
            relationships={[convertArtistProperties(item.author)]}
            onClickCallback={navigateTo}
          ></RelationshipInterpretation>
        )}
        <RelationshipInterpretation
          relationshipTitle="Contributors"
          relationships={item.contributors.map((p) =>
            convertArtistProperties(p)
          )}
          onClickCallback={navigateTo}
        ></RelationshipInterpretation>
        {item.album && (
          <RelationshipInterpretation
            relationshipTitle="Album"
            relationships={[convertAlbumProperties(item.album)]}
            onClickCallback={navigateTo}
          ></RelationshipInterpretation>
        )}
      </div>
    </>
  );
};

export default TrackItemRelationView;
