import DagrePathPlugin from './path';

export default function install({__spritejs, use, utils, registerNodeType}) {
  const {DagrePath} = use(DagrePathPlugin);
  const BaseNode = __spritejs.Rough ? __spritejs.Rough : DagrePath;
  const {flow, attr, inherit, parseFont} = utils;

  class DagreNodeAttr extends BaseNode.Attr {
    constructor(subject) {
      super(subject);
      this.setDefault({
        // width: 200,
        // height: 120,
        shape: 'inherit', // rectangle, roundedrect, parallel, ellispe, rhombus
        anchor: [0.5, 0.5],
      });
    }

    @attr
    @inherit('rectangle')
    set shape(val) {
      this.set('shape', val);
    }
  }

  const _node = Symbol('node');

  class DagreNode extends BaseNode {
    static Attr = DagreNodeAttr;

    @flow
    get contentSize() {
      let [width, height] = this.attrSize;
      if(width === '' || height === '') {
        const label = this.attr('label');
        if(label) {
          const font = this.attr('font');
          const context = this.context;
          if(context) {
            const {size: h} = parseFont(font);
            context.save();
            context.font = font;
            const {width: w} = context.measureText(label);
            context.restore();
            if(width === '') width = w * 2;
            if(height === '') height = h * 4;
          }
        }
        if(width === '') width = 0;
        if(height === '') height = 0;
      } else {
        [width, height] = super.contentSize;
      }
      const lineWidth = this.attr('lineWidth');
      return [width + lineWidth, height + lineWidth];
    }

    render(t, context) {
      const ret = super.render(t, context);
      context.save();
      const lw = this.attr('lineWidth') / 2;
      context.translate(lw, lw);
      const shape = this.attr('shape');

      if(this instanceof DagrePath) {
        const [width, height] = this.contentSize;
        context.beginPath();
        if(shape === 'ellispe') {
          context.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
        } else if(shape === 'roundedrect') {
          const x = 0,
            y = 0,
            w = width,
            h = height,
            r = Math.min(w, h) / 4;
          context.moveTo(x + r, y);
          context.arcTo(x + w, y, x + w, y + h, r);
          context.arcTo(x + w, y + h, x, y + h, r);
          context.arcTo(x, y + h, x, y, r);
          context.arcTo(x, y, x + w, y, r);
          context.closePath();
        } else if(shape === 'parallel') {
          const x = 0,
            y = 0,
            w = width,
            h = height,
            r = Math.min(w, h) / 4;
          context.moveTo(x + r, y);
          context.lineTo(x + w, y);
          context.lineTo(x + w - r, y + h);
          context.lineTo(x, y + h);
          context.closePath();
        } else if(shape === 'rhombus') {
          const x = 0,
            y = 0,
            w = width,
            h = height;
          context.moveTo(x + w / 2, y);
          context.lineTo(x + w, y + h / 2);
          context.lineTo(x + w / 2, y + h);
          context.lineTo(x, y + h / 2);
          context.closePath();
        } else {
          context.rect(0, 0, width, height);
        }
        context.stroke();
        const fillColor = this.attr('fillColor');
        if(fillColor) {
          context.fillStyle = fillColor;
          context.fill();
        }
        const label = this.attr('label');
        if(label) {
          this.once('afterdraw', ({context}) => {
            this.renderLabel(label, context);
          });
        }
      } else {
        const [width, height] = this.contentSize;

        if(!this.generators[_node]) {
          const generator = ret.context.generator;
          const options = ret.options;

          if(shape === 'ellispe') {
            this.generators[_node] = generator.ellipse(width / 2, height / 2, width, height, options);
          } else if(shape === 'roundedrect') {
            const x = 0,
              y = 0,
              w = width,
              h = height,
              r = Math.min(w, h) / 4;
            this.generators[_node] = [
              generator.arc(x + r, y + r, 2 * r, 2 * r, Math.PI, 1.5 * Math.PI, false, options),
              generator.line(x + r, y, w - r, y, options),
              generator.arc(w - r, y + r, 2 * r, 2 * r, 1.5 * Math.PI, 2 * Math.PI, false, options),
              generator.line(w, y + r, w, h - r, options),
              generator.arc(w - r, h - r, 2 * r, 2 * r, 0, 0.5 * Math.PI, false, options),
              generator.line(w - r, h, x + r, h, options),
              generator.arc(x + r, h - r, 2 * r, 2 * r, 0.5 * Math.PI, Math.PI, false, options),
              generator.line(x, h - r, x, y + r, options),
            ];
          } else if(shape === 'parallel') {
            const x = 0,
              y = 0,
              w = width,
              h = height,
              r = Math.min(w, h) / 4;
            this.generators[_node] = [
              generator.line(x + r, y, x + w, y, options),
              generator.line(x + w, y, x + w - r, y + h, options),
              generator.line(x + w - r, y + h, x, y + h, options),
              generator.line(x, y + h, x + r, y, options),
            ];
          } else if(shape === 'rhombus') {
            const x = 0,
              y = 0,
              w = width,
              h = height;
            this.generators[_node] = [
              generator.line(x + w / 2, y, x + w, y + h / 2, options),
              generator.line(x + w, y + h / 2, x + w / 2, y + h, options),
              generator.line(x + w / 2, y + h, x, y + h / 2, options),
              generator.line(x, y + h / 2, x + w / 2, y, options),
            ];
          } else {
            this.generators[_node] = generator.rectangle(0, 0, width, height, options);
          }
        }
        if(Array.isArray(this.generators[_node])) {
          this.generators[_node].forEach(n => ret.context.draw(n));
        } else {
          ret.context.draw(this.generators[_node]);
        }
      }
      context.restore();
      return ret;
    }
  }

  registerNodeType('dagreNode', DagreNode);

  return {DagreNode};
}