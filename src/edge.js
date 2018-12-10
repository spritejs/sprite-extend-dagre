import DagrePathPlugin from './path';

function parseStringPoints(points) {
  if(typeof points === 'string' && points !== '') {
    const p = points.split(',');
    const len = p.length;
    if(len < 4 || len % 2) {
      throw new Error('Invalid points data.');
    }
    const ret = [];
    for(let i = 0; i < len; i += 2) {
      ret.push([Number(p[i].trim()), Number(p[i + 1].trim())]);
    }
    return ret;
  }
  return points;
}

export default function install({__spritejs, use, utils, math, registerNodeType, Effects}) {
  const {DagrePath} = use(DagrePathPlugin);
  const BaseEdge = __spritejs.RoughPolyline ? __spritejs.RoughPolyline : DagrePath;
  const {attr, parseValue, inherit} = utils;
  const Matrix = math.Matrix;

  class DagreEdgeAttr extends BaseEdge.Attr {
    constructor(subject) {
      super(subject);
      this.setDefault({
        tolerance: 6,
        arrowSize: 'inherit',
        connection: '',
        points: [[0, 0], [0, 0], [0, 0]],
        d: 'M0,0L0,0L0,0',
        labelPos: 'inherit',
        labelOffset: 'inherit',
      });
    }

    get fillColor() {
      return '';
    }

    @attr
    set connection(val) {
      if(typeof val === 'string' && val !== '') {
        val = val.split(',').map(s => s.trim());
      }
      this.set('connection', val);
    }

    @parseValue(parseFloat)
    @attr
    set tolerance(val) {
      this.set('tolerance', val);
    }

    @parseValue(parseStringPoints)
    @attr
    set points(val) {
      let d = `M${val[0][0]},${val[0][1]}`;
      for(let i = 1; i < val.length; i++) {
        d += `L${val[i][0]},${val[i][1]}`;
      }
      if(this.closed) {
        d += 'z';
      }
      // this.d = 'M0,0L0,0L0,0';
      this.d = d;
      this.set('points', val);
    }

    @parseValue(parseFloat)
    @attr
    @inherit(24)
    set arrowSize(val) {
      this.set('arrowSize', val);
    }

    @attr
    @inherit('center')
    set labelPos(val) {
      if(this.subject.hasLayout) this.subject.parent.clearLayout();
      this.set('labelPos', val);
    }

    @parseValue(parseInt)
    @attr
    @inherit(10)
    set labelOffset(val) {
      if(this.subject.hasLayout) this.subject.parent.clearLayout();
      this.set('labelOffset', val);
    }

    get labelBg() {
      if(this.label.trim() === '') {
        return 'rgba(0, 0, 0, 0)';
      }
      let labelBg = super.labelBg;
      if(labelBg === '' && this.subject.parent) {
        labelBg = this.subject.parent.attr('bgcolor') || 'rgba(255,255,255,1)';
      }
      return labelBg;
    }

    @attr
    set label(val) {
      if(this.subject.hasLayout) this.subject.parent.clearLayout();
      super.label = val;
    }
  }

  const _path = Symbol('path');

  class DagreEdge extends BaseEdge {
    static Attr = DagreEdgeAttr;

    findPath(offsetX, offsetY) {
      const rect = this.originalRect;
      const pathOffset = this.pathOffset;
      const point = [offsetX - rect[0] - pathOffset[0], offsetY - rect[1] - pathOffset[1]];
      if(this.svg && this.svg.isPointInPath(...point)) {
        return [this.svg];
      }
      if(this.path2D_) {
        this.context.save();
        this.context.lineWidth = this.attr('lineWidth') + this.attr('tolerance');
        this.context.lineCap = this.attr('lineCap');
        this.context.lineJoin = this.attr('lineJoin');
        if(this.context.isPointInStroke(this.path2D_, ...point)) {
          return [this.svg];
        }
        this.context.restore();
      }
      return [];
    }

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

    render(t, context) {
      const ret = super.render(t, context);
      const d = this.attr('d');


      if(this instanceof DagrePath) {
        // const color = this.attr('strokeColor');
        // context.fillStyle = color;
        // context.fill();
        const label = this.attr('label');
        if(label) {
          this.once('afterdraw', ({context}) => {
            this.renderLabel(label, context);
          });
        }
        if(d) {
          if(typeof Path2D !== 'undefined') {
            this.path2D_ = new Path2D(this.svg.d);
          }
        }
        const arrowSize = this.attr('arrowSize');
        if(arrowSize > 0) {
          context.setLineDash([]);
          const points = this.attr('points');
          const line = points.slice(-2);
          const vector = [line[0][0] - line[1][0], line[0][1] - line[1][1]];
          const m = new Matrix();
          const len = Math.max(0.001, Math.sqrt(vector[0] ** 2 + vector[1] ** 2));
          const scale = arrowSize / len;
          const pv1 = m.rotate(30).scale(scale, scale).transformVector(...vector);
          const pv2 = m.unit().rotate(-30).scale(scale, scale).transformVector(...vector);
          const pv3 = m.unit().scale(1 + 3 / len, 1 + 3 / len).transformVector(...vector);
          const [x, y] = [line[0][0] - pv3[0], line[0][1] - pv3[1]];
          const d = `M${x},${y}L${x + pv1[0]},${y + pv1[1]}L${x + pv2[0]},${y + pv2[1]}z`;
          // console.log(d);
          const p = new Path2D(d);
          context.fillStyle = this.attr('strokeColor');
          context.fill(p);
        }
      } else {
        const arrowSize = this.attr('arrowSize');
        if(arrowSize > 0) {
          const points = this.attr('points');
          const line = points.slice(-2);
          const vector = [line[0][0] - line[1][0], line[0][1] - line[1][1]];
          const m = new Matrix();
          const len = Math.max(0.001, Math.sqrt(vector[0] ** 2 + vector[1] ** 2));
          const scale = arrowSize / len;
          const pv1 = m.unit().rotate(30).scale(scale, scale).transformVector(...vector);
          const pv2 = m.unit().rotate(-30).scale(scale, scale).transformVector(...vector);
          const [x, y] = line[1];
          const d = `M${x},${y}L${x + pv1[0]},${y + pv1[1]}M${x},${y}L${x + pv2[0]},${y + pv2[1]}`;
          context.restore();
          const options = Object.assign({}, ret.options);
          options.lineDash = [];
          if(!this.generators[_path]) {
            this.generators[_path] = ret.context.generator.path(d, options);
          }
          ret.context.draw(this.generators[_path]);
          context.save();
        }
      }
      return ret;
    }
  }

  const effect = Effects.arrayEffect;

  DagreEdge.setAttributeEffects({
    points(path1, path2, p, start, end) {
      const len = Math.max(path1.length, path2.length);
      const ret = [];
      for(let i = 0; i < len; i++) {
        const p1 = path1[Math.min(i, path1.length - 1)],
          p2 = path2[Math.min(i, path2.length - 1)];
        ret.push(effect(p1, p2, p, start, end));
      }
      return ret.slice(0, path2.length);
    },
  });

  registerNodeType('dagreEdge', DagreEdge);

  return {DagreEdge};
}