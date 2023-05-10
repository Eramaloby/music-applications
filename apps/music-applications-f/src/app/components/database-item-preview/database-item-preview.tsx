import React from 'react';
import { ItemPreview } from '../../types';

const DatabaseItemPreview = ({ item }: { item: ItemPreview }) => {
  return <div className='database-item-preview-wrapper'>
    {item.label}DATABASE
  </div>;
};

export default DatabaseItemPreview;
