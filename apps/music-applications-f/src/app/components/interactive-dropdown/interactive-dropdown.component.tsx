import { DropdownItem } from '../../types';
import InteractiveItemList from '../dropdown-item/dropdown-item.component';
import './interactive-dropdown-item.styles.scss';

type InteractiveDropdownProps = {
  results: DropdownItem[];
  onItemClickCallback: (item: DropdownItem) => void;
};

const InteractiveDropdown = ({
  results,
  onItemClickCallback,
}: InteractiveDropdownProps) => {
  return (
    <div className="dropdown-container">
      {results.map((item, index) => (
        <InteractiveItemList
          item={item}
          onItemClickCallback={onItemClickCallback}
          key={index}
        ></InteractiveItemList>
      ))}
    </div>
  );
};

export default InteractiveDropdown;
