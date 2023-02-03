import { DropdownItem } from '../../types';
import './dropdown-item.styles.scss';

type InteractiveItemListProps = {
  item: DropdownItem;
  onItemClickCallback: (item: DropdownItem) => void;
};

const InteractiveItemList = ({
  item,
  onItemClickCallback,
}: InteractiveItemListProps) => {
  return (
    <div className="clickable-dropdown-item">
      <div className="clickable-dropdown-item-text">
        <div className="dropdown-item-label">{item.label}</div>
        <div className="dropdown-item-type">{item.type}</div>
      </div>
      <button
        className="view-details-btn"
        onClick={() => onItemClickCallback(item)}
      >
        View details
      </button>
    </div>
  );
};

export default InteractiveItemList;
