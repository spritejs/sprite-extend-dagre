import NodePlugin from './node';

export default function install({__spritejs, use, utils, registerNodeType}) {
  const {DagreNode} = use(NodePlugin);

  class DagreParallel extends DagreNode {
    drawShape(context, width, height) {
      const x = 0,
        y = 0,
        w = width,
        h = height,
        r = Math.min(w, h) / 4;

      if(context.context) {
        const generator = context.context.generator;
        const options = context.options;
        return [
          generator.line(x + r, y, x + w, y, options),
          generator.line(x + w, y, x + w - r, y + h, options),
          generator.line(x + w - r, y + h, x, y + h, options),
          generator.line(x, y + h, x + r, y, options),
        ];
      }
      context.moveTo(x + r, y);
      context.lineTo(x + w, y);
      context.lineTo(x + w - r, y + h);
      context.lineTo(x, y + h);
      context.closePath();
    }
  }

  registerNodeType('dagreParallel', DagreParallel);

  return {DagreParallel};
}