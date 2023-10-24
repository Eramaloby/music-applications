import { GenreWithRelationships } from '../../../../types';
import React from 'react';
import './styles.scss';

const GenreItemRelationView = ({
  item,
  navigateTo,
}: {
  item: GenreWithRelationships;
  navigateTo: (type: string, id: number) => void;
}) => {
  return <div>GenreItemRelationView</div>;
};

export default GenreItemRelationView;
