import { Neo4jDbItem } from '../../../../types';

export const ToRelation = ({
  target,
  routingCallback,
}: {
  target: Neo4jDbItem;
  routingCallback: (type: string, name: string) => void;
}) => {
  // target.name is not accessible because maloy is daun

  return (
    <div
      className="database-item-to-relation"
      onClick={() => routingCallback(target.type, target.properties.name)}
    >
      {target.properties.name}
    </div>
  );
};

export default ToRelation;
