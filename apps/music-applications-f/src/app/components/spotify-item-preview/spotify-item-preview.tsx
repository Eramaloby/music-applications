import React from 'react';
import { ItemPreview } from '../../types';
import './spotify-item-preview.styles.scss';

const SpotifyItemPreview = ({
  item,
  onClickCallback,
}: {
  item: ItemPreview;
  onClickCallback: (spotify_id: string, type: string) => void;
}) => {
  return (
    <div className='spotify-preview-wrapper'>
      <div
      className="spotify-preview-item-wrapper"
      style={{ backgroundImage: `url(${item.image})` }}
      onClick={() => onClickCallback(item.spotify_id as string, item.type)}
      >
      </div>
      <div className="spotify-preview-info-container">
          <div className="spotify-preview-item-label">{item.label}</div>
          <div className="spotify-preview-item-type">{item.type}</div>
        </div>
    </div>
  );
};

export default SpotifyItemPreview;
