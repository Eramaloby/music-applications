import { AlbumWithRelationships } from '../../../../types';
import { PropertyDisplay } from './property';
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
  navigateTo: (type: string, id: string) => void;
}) => {
  const displayedProperties = Object.entries({
    Name: String(item.properties.name),
    'Count of tracks at album': String(item.properties.count_of_tracks),
    'Released at': String(item.properties.release_date),
    'Album label': String(item.properties.label),
    Type: String(item.properties.type),
    'Count of likes': String(item.properties.likes.low),
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
        {item.tracks && item.tracks.length > 0 && (
          <RelationshipInterpretation
            relationshipTitle="Tracks on album"
            onClickCallback={navigateTo}
            relationships={item.tracks.map((properties) =>
              convertTrackProperties(properties)
            )}
            key={1}
          ></RelationshipInterpretation>
        )}

        {item.genres && item.genres.length > 0 && (
          <RelationshipInterpretation
            relationshipTitle="Album genres"
            onClickCallback={navigateTo}
            relationships={item.genres.map((properties) =>
              convertGenreProperties(properties)
            )}
            key={2}
          ></RelationshipInterpretation>
        )}

        {authorInterpretation && authorInterpretation.length > 0 && (
          <RelationshipInterpretation
            relationshipTitle="Author"
            onClickCallback={navigateTo}
            relationships={authorInterpretation}
            key={3}
          ></RelationshipInterpretation>
        )}

        {item.contributors && item.contributors.length > 0 && (
          <RelationshipInterpretation
            relationshipTitle="Contributors"
            onClickCallback={navigateTo}
            relationships={item.contributors.map((properties) =>
              convertArtistProperties(properties)
            )}
            key={4}
          ></RelationshipInterpretation>
        )}
      </div>
    </>
  );
};

export default AlbumItemRelationView;
