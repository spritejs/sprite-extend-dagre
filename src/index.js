import Dagre from './dagre';
import DagreNode from './node';
import DagreEdge from './edge';

export function install({use}) {
  return [
    Dagre,
    DagreNode,
    DagreEdge,
  ].reduce((pkg, Node) => {
    return Object.assign(pkg, spritejs.use(Node));
  }, {});
}
