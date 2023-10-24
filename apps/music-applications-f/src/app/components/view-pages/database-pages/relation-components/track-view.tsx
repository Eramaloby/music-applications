import { TrackWithRelationships } from '../../../../types';
import React from 'react';
import './styles.scss';

const TrackItemRelationView = ({
  item,
  navigateTo,
}: {
  item: TrackWithRelationships;
  navigateTo: (type: string, id: number) => void;
}) => {
  return <div>TrackItemRelationView</div>;
};

export default TrackItemRelationView;
