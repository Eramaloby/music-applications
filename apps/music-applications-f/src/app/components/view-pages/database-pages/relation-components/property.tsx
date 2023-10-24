export const PropertyDisplay = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="item-property-wrapper">
      <div className="item-property-label">{label}: </div>
      <div className="item-property-value">{value}</div>
    </div>
  );
};
