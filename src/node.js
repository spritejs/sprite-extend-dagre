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
    set label(val) {
      super.label = val;
      this.clearFlow();
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

    get label() {
      return this.attr('label');
    }

    set label(val) {
      return this.attr('label', val);
    }

    get labelSize() {
      const label = this.attr('label');
      if(!label) return [0, 0];
      const font = this.attr('font');
      let width = 0;
      const context = this.context;
      if(context) {
        context.save();
        context.font = font;
        width = this.context.measureText(label).width;
        context.restore();
      }
      const {size} = utils.parseFont(font);
      return [width + 12, size + 12];
    }

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
            if(height === '') height = h * 3.5;
            if(width === '') width = Math.max(height, Math.min(w * 2, w + 120));
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

    drawShape(context, width, height) {
      /* implement by subclass */
    }

    render(t, context) {
      const ret = super.render(t, context);
      context.save();
      const lw = this.attr('lineWidth') / 2;
      context.translate(lw, lw);

      const [width, height] = this.contentSize;

      if(this instanceof DagrePath) {
        context.beginPath();
        this.drawShape(context, width, height);
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
        if(!this.generators[_node]) {
          this.generators[_node] = this.drawShape(ret, width, height);
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

  return {DagreNode};
}