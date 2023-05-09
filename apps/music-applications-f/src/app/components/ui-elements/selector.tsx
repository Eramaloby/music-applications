import React, { useState } from 'react';
import SelectorOption from './selector-option';

type ApplicationSelectorProps = {
  options: { value: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
  selectorClassName: string;
};
const ApplicationSelector = ({
  value,
  options,
  onChange,
  selectorClassName,
}: ApplicationSelectorProps) => {
  const [currentActiveValue, setCurrentActiveValue] = useState<string>(value);

  const handleChangeOnOption = (value: string) => {
    onChange(value);
    setCurrentActiveValue(value);
  };

  return (
    <div className={selectorClassName}>
      {options.map((option, key) => (
        <SelectorOption
          value={option.value}
          name={option.name}
          isActive={currentActiveValue === option.value}
          onChange={handleChangeOnOption}
          key={key}
        />
      ))}
    </div>
  );
};

export default ApplicationSelector;
