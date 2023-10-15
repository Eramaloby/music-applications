import { Neo4jDbItem } from '../../../types';
import { useRef } from 'react';
import { GraphCanvasRef } from 'reagraph';
import { GraphCanvas, darkTheme } from 'reagraph';
import { useNavigate} from 'react-router-dom';

const GraphViewPage = ({ item }: { item: Neo4jDbItem }) => {
  const router = useNavigate();

  const routingCallback = (type: string, id: number) =>
    router(`/db/${type}/${id}`);

  const nodes_g = [];
  const edges_g = [];
  const RED = '#ff3333';
  const BLUE = '#5c5cff';
  const GREEN = '#04bd3b';
  const YELLOW = '#d9d507';
  const GRAY = '#f5770a';

  nodes_g.push({ id: '-1', label: item.name });

  edges_g.push({
    source: '-1',
    target: '-2',
    id: '-1 -> -2',
    label: 'Edge -1 -> -2',
    size: 2,
  });
  edges_g.push({
    source: '-1',
    target: '-3',
    id: '-1 -> -3',
    label: 'Edge -1 -> -3',
    size: 2,
  });
  edges_g.push({
    source: '-1',
    target: '-4',
    id: '-1 -> -4',
    label: 'Edge -1 -> -4',
    size: 2,
  });
  edges_g.push({
    source: '-1',
    target: '-5',
    id: '-1 -> -5',
    label: 'Edge -1 -> -5',
    size: 2,
  });
  edges_g.push({
    source: '-1',
    target: '-6',
    id: '-1 -> -6',
    label: 'Edge -1 -> -6',
    size: 2,
  });
  const graphRef = useRef<GraphCanvasRef | null>(null);
  return (
    <div>
      <div>
        {item.relations.map(
          (relation: { type: string; target: Neo4jDbItem }, index: number) => {
            if (relation.target.type === 'Track') {
              nodes_g.push({ id: '-2', label: 'Track', fill: RED, data: {} });
            } else if (relation.target.type === 'Artist') {
              nodes_g.push({ id: '-3', label: 'Artist', fill: BLUE, data: {} });
            } else if (relation.target.type === 'Album') {
              nodes_g.push({ id: '-4', label: 'Album', fill: GREEN, data: {} });
            } else if (relation.target.type === 'Genre') {
              nodes_g.push({ id: '-5', label: 'Genre', fill: YELLOW, data: {} });
            } else if (relation.target.type === 'Playlist') {
              nodes_g.push({ id: '-6', label: 'Playlist', fill: GRAY, data: {} });
            }
            return <div></div>;
          }
        )}
        {item.relations.map(
          (relation: { type: string; target: Neo4jDbItem }, index: number) => {
            let fill = '';
            let type = '';
            let data = {};

            if (relation.target.type === 'Track') {
              fill = RED;
              type = '-2';
              data = [relation.target.type, relation.target.properties.id];
            } else if (relation.target.type === 'Artist') {
              fill = BLUE;
              type = '-3';
              data = [relation.target.type, relation.target.properties.id];
            } else if (relation.target.type === 'Album') {
              fill = GREEN;
              type = '-4';
              data = [relation.target.type, relation.target.properties.id];
            } else if (relation.target.type === 'Genre') {
              fill = YELLOW;
              type = '-5';
              data = [relation.target.type, relation.target.properties.id];
            } else if (relation.target.type === 'Playlist') {
              fill = GRAY;
              type = '-6';
              data = [relation.target.type, relation.target.properties.id];
            }

            nodes_g.push({
              id: String(index),
              label: relation.target.properties.name,
              fill: fill,
              data : data,
            });
            edges_g.push({
              source: type,
              target: String(index),
              id: '-1 -> ' + index,
              label: relation.target.type,
              size: 2,
            });
            return <div></div>;
          }
        )}
      </div>
      <div className="database-graph-form">
        <GraphCanvas
          ref={graphRef}
          draggable
          lassoType="node"
          // layoutType="radialOut2d"
          labelFontUrl="https://ey2pz3.csb.app/NotoSansSC-Regular.ttf"
          nodes={nodes_g}
          edges={edges_g}
          onEdgeClick={(edge) => alert(`${edge.label}`)}
          onNodeDoubleClick={(node) => routingCallback(node.data[0], node.data[1])}
          labelType="all"
          theme={darkTheme}
        />
      </div>
    </div>
  );
};

export default GraphViewPage;
