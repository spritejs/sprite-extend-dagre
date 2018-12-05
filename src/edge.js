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

export default function install({__spritejs, use, utils, math, registerNodeType}) {
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
      this.d = d;
      this.set('points', val);
    }

    @parseValue(parseFloat)
    @attr
    @inherit(24)
    set arrowSize(val) {
      this.set('arrowSize', val);
    }

    get labelX() {
      const x = this.get('labelX');
      if(x === '') {
        const points = this.get('points');
        return points[1][0];
      }
      return x;
    }

    get labelY() {
      const y = this.get('labelY');
      if(y === '') {
        const points = this.get('points');
        return points[1][1];
      }
      return y;
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
          const len = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
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
          const scale = arrowSize / Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
          const pv1 = m.rotate(30).scale(scale, scale).transformVector(...vector);
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

  registerNodeType('dagreEdge', DagreEdge);

  return {DagreEdge};
}