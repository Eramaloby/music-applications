import { ArtistWithRelationships } from '../../../../types';
import React from 'react';
import './styles.scss';
import { PropertyDisplay } from './property';
import {
  convertAlbumProperties,
  convertGenreProperties,
  convertTrackProperties,
} from './utils';
import { RelationshipInterpretation } from './relationship';

const ArtistItemRelationView = ({
  item,
  navigateTo,
}: {
  item: ArtistWithRelationships;
  navigateTo: (type: string, id: number) => void;
}) => {
  const displayedProperties = Object.entries({
    Name: String(item.properties.name),
    'About artist': item.properties.description,
    'Artist type': item.properties.type,
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
          relationshipTitle="Artist genres"
          relationships={item.genres.map((p) => convertGenreProperties(p))}
          onClickCallback={navigateTo}
        ></RelationshipInterpretation>
        <RelationshipInterpretation
          relationshipTitle="Albums author"
          relationships={item.albumAuthor.map((p) => convertAlbumProperties(p))}
          onClickCallback={navigateTo}
        ></RelationshipInterpretation>
        <RelationshipInterpretation
          relationshipTitle="Albums contributed"
          relationships={item.albumContributor.map((p) =>
            convertAlbumProperties(p)
          )}
          onClickCallback={navigateTo}
        ></RelationshipInterpretation>
        <RelationshipInterpretation
          relationshipTitle="Tracks author"
          relationships={item.tracksAuthor.map((p) =>
            convertTrackProperties(p)
          )}
          onClickCallback={navigateTo}
        ></RelationshipInterpretation>
        <RelationshipInterpretation
          relationshipTitle="Tracks contributed"
          relationships={item.tracksContributor.map((p) =>
            convertTrackProperties(p)
          )}
          onClickCallback={navigateTo}
        ></RelationshipInterpretation>
      </div>
    </>
  );
};

export default ArtistItemRelationView;
