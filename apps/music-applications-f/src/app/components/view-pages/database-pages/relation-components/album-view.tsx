import { AlbumWithRelationships } from '../../../../types';
import { PropertyDisplay } from './property';
import { Tooltip } from '@mui/material';
import {
  RelationshipViewInterpretation,
  convertArtistProperties,
  convertGenreProperties,
  convertTrackProperties,
} from './utils';
import './styles.scss';
import { RelationshipInterpretation } from './relationship';

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

  // display in other way?
  const authorInterpretation: RelationshipViewInterpretation[] = [
    convertArtistProperties(item.author),
  ];

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
          relationshipTitle="Tracks on album"
          onClickCallback={navigateTo}
          relationships={item.tracks.map((properties) =>
            convertTrackProperties(properties)
          )}
        ></RelationshipInterpretation>
        <RelationshipInterpretation
          relationshipTitle="Album genres"
          onClickCallback={navigateTo}
          relationships={item.genres.map((properties) =>
            convertGenreProperties(properties)
          )}
        ></RelationshipInterpretation>
        <RelationshipInterpretation
          relationshipTitle="Author"
          onClickCallback={navigateTo}
          relationships={authorInterpretation}
        ></RelationshipInterpretation>
        <RelationshipInterpretation
          relationshipTitle="Contributors"
          onClickCallback={navigateTo}
          relationships={item.contributors.map((properties) =>
            convertArtistProperties(properties)
          )}
        ></RelationshipInterpretation>
      </div>
    </>
  );
};

export default AlbumItemRelationView;
