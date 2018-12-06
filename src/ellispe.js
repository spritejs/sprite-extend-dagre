import NodePlugin from './node';

export default function install({__spritejs, use, utils, registerNodeType}) {
  const {DagreNode} = use(NodePlugin);

  class DagreEllispe extends DagreNode {
    drawShape(context, width, height) {
      if(context.context) {
        const generator = context.context.generator;
        const options = context.options;
        return generator.ellipse(width / 2, height / 2, width, height, options);
      }
      context.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
    }
  }

  registerNodeType('dagreEllispe', DagreEllispe);

  return {DagreEllispe};
}