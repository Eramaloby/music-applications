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
  //добавить проверку на входимость в сущность

  
  edges.push({
    source: '-1',
    target: '-2',
    id: '-1 -> -2',
    label: 'Edge -1 -> -2',
    size: 2,
  });
  edges.push({
    source: '-1',
    target: '-3',
    id: '-1 -> -3',
    label: 'Edge -1 -> -3',
    size: 2,
  });
  edges.push({
    source: '-1',
    target: '-4',
    id: '-1 -> -4',
    label: 'Edge -1 -> -4',
    size: 2,
  });
  edges.push({
    source: '-1',
    target: '-5',
    id: '-1 -> -5',
    label: 'Edge -1 -> -5',
    size: 2,
  });
  edges.push({
    source: '-1',
    target: '-6',
    id: '-1 -> -6',
    label: 'Edge -1 -> -6',
    size: 2,
  });
  console.log(nodes);
  console.log(edges);
  return (
    <div>
      <div>
        {item.relations.map((relation: any, index: number) => {
          if (relation.target.type === 'Track') {
            nodes.push({ id: '-2', label: "Track", fill: RED, });
          }
          else if (relation.target.type === 'Artist') {
            nodes.push({ id: '-3', label: "Artist", fill: BLUE, });
          }
          else if (relation.target.type === 'Album') {
            nodes.push({ id: '-4', label: "Album", fill: GREEN, });
          }
          else if (relation.target.type === 'Genre') {
            nodes.push({ id: '-5', label: "Genre", fill: YELLOW, });
          }
          else if (relation.target.type === 'Playlist') {
            nodes.push({ id: '-6', label: "Playlist", fill: GRAY, });
          }
          return <></>;
        })}
        {item.relations.map((relation: any, index: number) => {
          let fill = '';
          let type = '';

          if (relation.target.type === 'Track') {
            fill = RED;
            type = '-2';
          }
          else if (relation.target.type === 'Artist') {
            fill = BLUE;
            type = '-3';
          }
          else if (relation.target.type === 'Album') {
            fill = GREEN;
            type = '-4';
          }
          else if (relation.target.type === 'Genre') {
            fill = YELLOW;
            type = '-5';
          }
          else if (relation.target.type === 'Playlist') {
            fill = GRAY;
            type = '-6';
          }

          nodes.push({
            id: String(index),
            label: relation.target.properties.name,
            fill: fill,
          });
          edges.push({
            source: type,
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
          // layoutType="radialOut2d"
          labelFontUrl='https://ey2pz3.csb.app/NotoSansSC-Regular.ttf'
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
