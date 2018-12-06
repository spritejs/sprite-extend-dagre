import Dagre from './dagre';
import DagreNode from './node';
import DagreEdge from './edge';
import DagreRectangle from './rectangle';
import DagreRoundedrect from './roundedrect';
import DagreEllispe from './ellispe';
import DagreRhombus from './rhombus';
import DagreParallel from './parallel';

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
