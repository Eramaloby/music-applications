import React from 'react';
import { ItemPreview } from '../../types';
import SpotifyItemPreview from '../spotify-item-preview/spotify-item-preview';
import DatabaseItemPreview from '../database-item-preview/database-item-preview';

type ViewPanelContainerProps = {
  title: string;
  items: ItemPreview[];
};

const ViewPanelContainer = ({ title, items }: ViewPanelContainerProps) => {
  return (
    <div className="view-panel-wrapper">
      <div className="view-panel-title">{title}</div>
      <div className="view-panel-items">
        {items.map((value) => {
          if (value.spotify_id) {
            return <SpotifyItemPreview item={value}></SpotifyItemPreview>;
          } else {
            return <DatabaseItemPreview item={value}></DatabaseItemPreview>;
          }
        })}
      </div>
    </div>
  );
};

export default ViewPanelContainer;
