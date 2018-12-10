import Dagre from './dagre';
import DagreNode from './node';
import DagreEdge from './edge';
import DagreRectangle from './nodes/rectangle';
import DagreRoundedrect from './nodes/roundedrect';
import DagreEllipse from './nodes/ellipse';
import DagreRhombus from './nodes/rhombus';
import DagreParallel from './nodes/parallel';

// auto use
if(typeof window !== 'undefined' && window.spritejs) {
  window.spritejs.use(install);
}

export function install({use}) {
  return [
    Dagre,
    DagreNode,
    DagreEdge,
    DagreRectangle,
    DagreRoundedrect,
    DagreEllipse,
    DagreRhombus,
    DagreParallel,
  ].reduce((pkg, Node) => {
    return Object.assign(pkg, spritejs.use(Node));
  }, {});
}
