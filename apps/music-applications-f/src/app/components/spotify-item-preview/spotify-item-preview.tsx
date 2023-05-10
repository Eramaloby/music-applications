import React from 'react';
import { ItemPreview } from '../../types';

const SpotifyItemPreview = ({ item }: { item: ItemPreview }) => {
  return <div className="spotify-preview-item-wrapper">{item.label}SPOTIFY</div>;
};

export default SpotifyItemPreview;
