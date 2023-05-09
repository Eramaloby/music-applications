type SelectorOptionProps = {
  value: string;
  name: string;
  isActive: boolean;
  onChange: (value: string) => void;
};

const SelectorOption = ({
  value,
  name,
  isActive,
  onChange,
}: SelectorOptionProps) => {
  const currentClassName = isActive
    ? 'selector-option-active'
    : 'selector-option';
  return (
    <div className={currentClassName} onClick={() => onChange(value)}>
      {name}
    </div>
  );
};

export default SelectorOption;
