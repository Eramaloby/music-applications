import { PlaylistWithRelationships } from '../../../../types';
import React from 'react';
import './styles.scss';

const PlaylistItemRelationView = ({
  item,
  navigateTo,
}: {
  item: PlaylistWithRelationships;
  navigateTo: (type: string, id: number) => void;
}) => {
  return <div>PlaylistItemRelationView</div>;
};

export default PlaylistItemRelationView;
