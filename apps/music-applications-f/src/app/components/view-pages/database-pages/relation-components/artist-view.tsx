import { ArtistWithRelationships } from '../../../../types';
import React from 'react';
import './styles.scss';

const ArtistItemRelationView = ({
  item,
  navigateTo,
}: {
  item: ArtistWithRelationships;
  navigateTo: (type: string, id: number) => void;
}) => {
  return <div>ArtistRelationView</div>;
};

export default ArtistItemRelationView;
