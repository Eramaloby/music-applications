import { DropdownItem } from '../../types';
import InteractiveItemList from '../dropdown-item/dropdown-item.component';
import './interactive-dropdown-item.styles.scss';

type InteractiveDropdownProps = {
  list: DropdownItem[];
  ocurredError: string;
  setOcurredError: (error: string) => void;
  onItemClickCallback: (item: DropdownItem) => void;
};

const InteractiveDropdown = ({
  list,
  ocurredError,
  setOcurredError,
  onItemClickCallback,
}: InteractiveDropdownProps) => {
  if (list.length === 0) {
    return <div className="error-message">{ocurredError}</div>;
  } else {
    return list.map((item, index) => (
      <InteractiveItemList
        item={item}
        onItemClickCallback={onItemClickCallback}
        key={index}
      ></InteractiveItemList>
    ));
  }
};

export default InteractiveDropdown;
