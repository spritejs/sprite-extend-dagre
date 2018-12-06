import NodePlugin from './node';

export default function install({__spritejs, use, utils, registerNodeType}) {
  const {DagreNode} = use(NodePlugin);

  class DagreRhombus extends DagreNode {
    drawShape(context, width, height) {
      const x = 0,
        y = 0,
        w = width,
        h = height;
      if(context.context) {
        const generator = context.context.generator;
        const options = context.options;
        return [
          generator.line(x + w / 2, y, x + w, y + h / 2, options),
          generator.line(x + w, y + h / 2, x + w / 2, y + h, options),
          generator.line(x + w / 2, y + h, x, y + h / 2, options),
          generator.line(x, y + h / 2, x + w / 2, y, options),
        ];
      }
      context.moveTo(x + w / 2, y);
      context.lineTo(x + w, y + h / 2);
      context.lineTo(x + w / 2, y + h);
      context.lineTo(x, y + h / 2);
      context.closePath();
    }
  }

  registerNodeType('dagreRhombus', DagreRhombus);

  return {DagreRhombus};
}