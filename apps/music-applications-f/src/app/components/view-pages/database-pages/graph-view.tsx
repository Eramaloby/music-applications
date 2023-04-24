import {
  AlbumProperties,
  Neo4jDbItem,
  PlaylistProperties,
  TrackProperties,
} from '../../../types';
import { GraphCanvas, darkTheme } from 'reagraph';

const GraphViewPage = ({ item }: { item: Neo4jDbItem }) => {
  console.log(item);
  const nodes = [];
  const edges = [];
  const RED = '#ff3333';
  const BLUE = '#5c5cff';
  const GREEN = '#04bd3b';
  const YELLOW = '#d9d507';
  const GRAY = '#f5770a';
  nodes.push({ id: '-1', label: item.properties.name });
  edges.push({
    source: '-1',
    target: '-1',
    id: '-1 -> -1',
    label: 'Edge -1 -> -1',
    size: 2,
  });
  console.log(nodes);
  console.log(edges);
  return (
    <div>
      <div>
        {item.relations.map((relation: any, index: number) => {
          let fill = '';

          relation.target.type === 'Track'
            ? (fill = RED)
            : relation.target.type === 'Artist'
            ? (fill = BLUE)
            : relation.target.type === 'Album'
            ? (fill = GREEN)
            : relation.target.type === 'Genre'
            ? (fill = YELLOW)
            : relation.target.type === 'Playlist'
            ? (fill = GRAY)
            : (fill = '');

          nodes.push({
            id: String(index),
            label: relation.target.properties.name,
            fill: fill,
          });
          edges.push({
            source: '-1',
            target: String(index),
            id: '-1 -> ' + index,
            label: relation.target.type,
            size: 2,
          });
          return <div></div>;
        })}
      </div>
      <div className="database-graph-form">
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          onEdgeClick={(edge) => alert(`${edge.label}`)}
          contextMenu={({ data, onClose }) => (
            <div
              style={{
                opacity: 0.9,
                background: 'gray',
                width: 150,
                border: 'solid 1px blue',
                borderRadius: 2,
                padding: 5,
                textAlign: 'center',
              }}
            >
              <h1>{data.label}</h1>
              <button onClick={onClose}>Close Menu</button>
            </div>
          )}
          labelType="nodes"
          theme={darkTheme}
        />
      </div>
    </div>
  );
};

export default GraphViewPage;
