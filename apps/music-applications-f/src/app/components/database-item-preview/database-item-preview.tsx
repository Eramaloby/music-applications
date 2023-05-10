import { ItemPreview } from '../../types';
import './database-item-preview.styles.scss'

const DatabaseItemPreview = ({
  item,
  onClickCallback,
}: {
  item: ItemPreview;
  onClickCallback: (id: number, type: string) => void;
}) => {
  return (
    <div
      className="database-item-preview-wrapper"
      onClick={() => onClickCallback(item.databaseId as number, item.type)}
    >
      <div className="database-item-info-container">
        <div className="database-item-type">{item.type}</div>
        <div className="database-item-label">{item.label}</div>
      </div>
    </div>
  );
};

export default DatabaseItemPreview;
