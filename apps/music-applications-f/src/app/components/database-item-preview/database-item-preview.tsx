import { ItemPreview } from '../../types';
import './database-item-preview.styles.scss';

const DatabaseItemPreview = ({
  item,
  onClickCallback,
}: {
  item: ItemPreview;
  onClickCallback: (id: number, type: string) => void;
}) => {
  const S_COLOR =
    'rgb(' +
    Math.floor(Math.random() * 255) +
    ', ' +
    Math.floor(Math.random() * 255) +
    ', ' +
    Math.floor(Math.random() * 255) +
    ')';
  const M_COLOR =
    'rgb(' +
    Math.floor(Math.random() * 255) +
    ', ' +
    Math.floor(Math.random() * 255) +
    ', ' +
    Math.floor(Math.random() * 255) +
    ')';
  return (
    <div className="database-preview-wrapper">
      {item.image ? (
        <div
          className="database-item-preview-wrapper"
          style={{
            backgroundImage: `url(${item.image.url})`,
          }}
          onClick={() => onClickCallback(item.databaseId as number, item.type)}
        ></div>
      ) : (
        <div
          className="database-item-preview-wrapper"
          style={{
            background: `linear-gradient(90deg, ${S_COLOR} 0%, ${M_COLOR} 51%, ${S_COLOR} 100%)`,
          }}
          onClick={() => onClickCallback(item.databaseId as number, item.type)}
        ></div>
      )}

      <div className="database-item-info-container">
        <div className="database-item-type">{item.type}</div>
        <div className="database-item-label">{item.label}</div>
      </div>
    </div>
  );
};

export default DatabaseItemPreview;
