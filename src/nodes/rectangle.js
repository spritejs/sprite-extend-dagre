import NodePlugin from '../node';

export default function install({__spritejs, use, utils, registerNodeType}) {
  const {DagreNode} = use(NodePlugin);

  class DagreRectangle extends DagreNode {
    drawShape(context, width, height) {
      if(context.context) {
        const generator = context.context.generator;
        const options = context.options;
        return generator.rectangle(0, 0, width, height, options);
      }
      context.rect(0, 0, width, height);
    }
  }

  registerNodeType('dagreRectangle', DagreRectangle);

  return {DagreRectangle};
}