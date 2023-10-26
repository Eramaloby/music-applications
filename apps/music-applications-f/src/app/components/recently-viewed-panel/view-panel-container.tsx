import React from 'react';
import { ItemPreview } from '../../types';
import SpotifyItemPreview from '../spotify-item-preview/spotify-item-preview';
import DatabaseItemPreview from '../database-item-preview/database-item-preview';
import './view-panel-container.styles.scss';
import { useNavigate } from 'react-router-dom';

type ViewPanelContainerProps = {
  title: string;
  items: ItemPreview[];
  containerClassName: string;
};

const ViewPanelContainer = ({ title, items, containerClassName }: ViewPanelContainerProps) => {
  const router = useNavigate();

  return (
    <div className={`${containerClassName}-wrapper`}>
      <div className={`${containerClassName}-title`}>{title}</div>
      <div className={`${containerClassName}-items`}>
        {items.map((value, key) => {
          if (value.spotify_id) {
            return (
              <SpotifyItemPreview
                item={value}
                key={key}
                onClickCallback={(spotify_id: string, type: string) =>
                  router(`/web/${type}/${spotify_id}`)
                }
              ></SpotifyItemPreview>
            );
          } else {
            return (
              <DatabaseItemPreview
                item={value}
                key={key}
                onClickCallback={(id: string, type: string) =>
                  router(`/db/${type}/${id}`)
                }
              ></DatabaseItemPreview>
            );
          }
        })}
      </div>
    </div>
  );
};

export default ViewPanelContainer;
