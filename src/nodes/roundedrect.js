import NodePlugin from '../node';

export default function install({__spritejs, use, utils, registerNodeType}) {
  const {DagreNode} = use(NodePlugin);

  class DagreRoundedrect extends DagreNode {
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
          generator.arc(x + r, y + r, 2 * r, 2 * r, Math.PI, 1.5 * Math.PI, false, options),
          generator.line(x + r, y, w - r, y, options),
          generator.arc(w - r, y + r, 2 * r, 2 * r, 1.5 * Math.PI, 2 * Math.PI, false, options),
          generator.line(w, y + r, w, h - r, options),
          generator.arc(w - r, h - r, 2 * r, 2 * r, 0, 0.5 * Math.PI, false, options),
          generator.line(w - r, h, x + r, h, options),
          generator.arc(x + r, h - r, 2 * r, 2 * r, 0.5 * Math.PI, Math.PI, false, options),
          generator.line(x, h - r, x, y + r, options),
        ];
      }
      context.moveTo(x + r, y);
      context.arcTo(x + w, y, x + w, y + h, r);
      context.arcTo(x + w, y + h, x, y + h, r);
      context.arcTo(x, y + h, x, y, r);
      context.arcTo(x, y, x + w, y, r);
      context.closePath();
    }
  }

  registerNodeType('dagreRoundedrect', DagreRoundedrect);

  return {DagreRoundedrect};
}