import {
  AlbumProperties,
  ArtistProperties,
  GenreProperties,
  PlaylistProperties,
  TrackProperties,
} from '../../../../types';
import { convertDuration } from '../../../../utils';

export const convertTrackProperties = (
  properties: TrackProperties
): RelationshipViewInterpretation => {
  return {
    label: properties.name,
    id: properties.id,
    typeOfSourceOrTarget: 'track',
    textForTooltip: `Duration: ${convertDuration(
      properties.duration_ms
    )}\nContains explicit lyrics: ${properties.explicit ? 'Yes' : 'No'}`,
  };
};

export const convertGenreProperties = (
  properties: GenreProperties
): RelationshipViewInterpretation => {
  return {
    label: properties.name,
    id: properties.id,
    typeOfSourceOrTarget: 'genre',
    textForTooltip: `Description: ${properties.description}`,
  };
};

export const convertArtistProperties = (
  properties: ArtistProperties
): RelationshipViewInterpretation => {
  return {
    label: properties.name,
    id: properties.id,
    typeOfSourceOrTarget: 'artist',
    textForTooltip: `Description: ${properties.description}\nType: ${properties.type}`,
  };
};

export const convertPlaylistProperties = (
  properties: PlaylistProperties
): RelationshipViewInterpretation => {
  return {
    label: properties.name,
    id: properties.id,
    typeOfSourceOrTarget: 'playlist',
    textForTooltip: `Description: ${properties.description}\nOwner name: ${properties.owner_name}`,
  };
};

export const convertAlbumProperties = (
  properties: AlbumProperties
): RelationshipViewInterpretation => {
  return {
    label: properties.name,
    id: properties.id,
    typeOfSourceOrTarget: 'album',
    textForTooltip: `Label: ${properties.label}\nRelease date: ${properties.release_date}`,
  };
};

export interface RelationshipViewInterpretation {
  label: string;
  textForTooltip: string;
  id: number;
  typeOfSourceOrTarget: string;
}
