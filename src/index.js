import Dagre from './dagre';
import DagreNode from './node';
import DagreEdge from './edge';
import DagreRectangle from './nodes/rectangle';
import DagreRoundedrect from './nodes/roundedrect';
import DagreEllispe from './nodes/ellispe';
import DagreRhombus from './nodes/rhombus';
import DagreParallel from './nodes/parallel';

export function install({use}) {
  return [
    Dagre,
    DagreNode,
    DagreEdge,
    DagreRectangle,
    DagreRoundedrect,
    DagreEllispe,
    DagreRhombus,
    DagreParallel,
  ].reduce((pkg, Node) => {
    return Object.assign(pkg, spritejs.use(Node));
  }, {});
}
