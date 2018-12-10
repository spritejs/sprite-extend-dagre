'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _set2 = require('babel-runtime/helpers/set');

var _set3 = _interopRequireDefault(_set2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = install;

var _path2 = require('./path');

var _path3 = _interopRequireDefault(_path2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _applyDecoratedDescriptor = require('babel-decorators-runtime');

function parseStringPoints(points) {
  if (typeof points === 'string' && points !== '') {
    var p = points.split(',');
    var len = p.length;
    if (len < 4 || len % 2) {
      throw new Error('Invalid points data.');
    }
    var ret = [];
    for (var i = 0; i < len; i += 2) {
      ret.push([Number(p[i].trim()), Number(p[i + 1].trim())]);
    }
    return ret;
  }
  return points;
}

function install(_ref) {
  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _desc, _value, _class, _class2, _temp;

  var __spritejs = _ref.__spritejs,
      use = _ref.use,
      utils = _ref.utils,
      math = _ref.math,
      registerNodeType = _ref.registerNodeType,
      Effects = _ref.Effects;

  var _use = use(_path3.default),
      DagrePath = _use.DagrePath;

  var BaseEdge = __spritejs.RoughPolyline ? __spritejs.RoughPolyline : DagrePath;
  var attr = utils.attr,
      parseValue = utils.parseValue,
      inherit = utils.inherit;

  var Matrix = math.Matrix;

  var DagreEdgeAttr = (_dec = parseValue(parseFloat), _dec2 = parseValue(parseStringPoints), _dec3 = parseValue(parseFloat), _dec4 = inherit(24), _dec5 = inherit('center'), _dec6 = parseValue(parseInt), _dec7 = inherit(10), (_class = function (_BaseEdge$Attr) {
    (0, _inherits3.default)(DagreEdgeAttr, _BaseEdge$Attr);

    function DagreEdgeAttr(subject) {
      (0, _classCallCheck3.default)(this, DagreEdgeAttr);

      var _this = (0, _possibleConstructorReturn3.default)(this, (DagreEdgeAttr.__proto__ || (0, _getPrototypeOf2.default)(DagreEdgeAttr)).call(this, subject));

      _this.setDefault({
        tolerance: 6,
        arrowSize: 'inherit',
        connection: '',
        points: [[0, 0], [0, 0], [0, 0]],
        d: 'M0,0L0,0L0,0',
        labelPos: 'inherit',
        labelOffset: 'inherit'
      });
      return _this;
    }

    (0, _createClass3.default)(DagreEdgeAttr, [{
      key: 'fillColor',
      get: function get() {
        return '';
      }
    }, {
      key: 'connection',
      set: function set(val) {
        if (typeof val === 'string' && val !== '') {
          val = val.split(',').map(function (s) {
            return s.trim();
          });
        }
        this.set('connection', val);
      }
    }, {
      key: 'tolerance',
      set: function set(val) {
        this.set('tolerance', val);
      }
    }, {
      key: 'points',
      set: function set(val) {
        var d = 'M' + val[0][0] + ',' + val[0][1];
        for (var i = 1; i < val.length; i++) {
          d += 'L' + val[i][0] + ',' + val[i][1];
        }
        if (this.closed) {
          d += 'z';
        }
        // this.d = 'M0,0L0,0L0,0';
        this.d = d;
        this.set('points', val);
      }
    }, {
      key: 'arrowSize',
      set: function set(val) {
        this.set('arrowSize', val);
      }
    }, {
      key: 'labelPos',
      set: function set(val) {
        if (this.subject.hasLayout) this.subject.parent.clearLayout();
        this.set('labelPos', val);
      }
    }, {
      key: 'labelOffset',
      set: function set(val) {
        if (this.subject.hasLayout) this.subject.parent.clearLayout();
        this.set('labelOffset', val);
      }
    }, {
      key: 'labelBg',
      get: function get() {
        if (this.label.trim() === '') {
          return 'rgba(0, 0, 0, 0)';
        }
        var labelBg = (0, _get3.default)(DagreEdgeAttr.prototype.__proto__ || (0, _getPrototypeOf2.default)(DagreEdgeAttr.prototype), 'labelBg', this);
        if (labelBg === '' && this.subject.parent) {
          labelBg = this.subject.parent.attr('bgcolor') || 'rgba(255,255,255,1)';
        }
        return labelBg;
      }
    }, {
      key: 'label',
      set: function set(val) {
        if (this.subject.hasLayout) this.subject.parent.clearLayout();
        (0, _set3.default)(DagreEdgeAttr.prototype.__proto__ || (0, _getPrototypeOf2.default)(DagreEdgeAttr.prototype), 'label', val, this);
      }
    }]);
    return DagreEdgeAttr;
  }(BaseEdge.Attr), (_applyDecoratedDescriptor(_class.prototype, 'connection', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'connection'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'tolerance', [_dec, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'tolerance'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'points', [_dec2, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'points'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'arrowSize', [_dec3, attr, _dec4], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'arrowSize'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'labelPos', [attr, _dec5], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'labelPos'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'labelOffset', [_dec6, attr, _dec7], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'labelOffset'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'label', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'label'), _class.prototype)), _class));


  var _path = (0, _symbol2.default)('path');

  var DagreEdge = (_temp = _class2 = function (_BaseEdge) {
    (0, _inherits3.default)(DagreEdge, _BaseEdge);

    function DagreEdge() {
      (0, _classCallCheck3.default)(this, DagreEdge);
      return (0, _possibleConstructorReturn3.default)(this, (DagreEdge.__proto__ || (0, _getPrototypeOf2.default)(DagreEdge)).apply(this, arguments));
    }

    (0, _createClass3.default)(DagreEdge, [{
      key: 'findPath',
      value: function findPath(offsetX, offsetY) {
        var _svg;

        var rect = this.originalRect;
        var pathOffset = this.pathOffset;
        var point = [offsetX - rect[0] - pathOffset[0], offsetY - rect[1] - pathOffset[1]];
        if (this.svg && (_svg = this.svg).isPointInPath.apply(_svg, point)) {
          return [this.svg];
        }
        if (this.path2D_) {
          var _context;

          this.context.save();
          this.context.lineWidth = this.attr('lineWidth') + this.attr('tolerance');
          this.context.lineCap = this.attr('lineCap');
          this.context.lineJoin = this.attr('lineJoin');
          if ((_context = this.context).isPointInStroke.apply(_context, [this.path2D_].concat(point))) {
            return [this.svg];
          }
          this.context.restore();
        }
        return [];
      }
    }, {
      key: 'render',
      value: function render(t, context) {
        var _this3 = this;

        var ret = (0, _get3.default)(DagreEdge.prototype.__proto__ || (0, _getPrototypeOf2.default)(DagreEdge.prototype), 'render', this).call(this, t, context);
        var d = this.attr('d');

        if (this instanceof DagrePath) {
          // const color = this.attr('strokeColor');
          // context.fillStyle = color;
          // context.fill();
          var label = this.attr('label');
          if (label) {
            this.once('afterdraw', function (_ref2) {
              var context = _ref2.context;

              _this3.renderLabel(label, context);
            });
          }
          if (d) {
            if (typeof Path2D !== 'undefined') {
              this.path2D_ = new Path2D(this.svg.d);
            }
          }
          var arrowSize = this.attr('arrowSize');
          if (arrowSize > 0) {
            var _m$rotate$scale, _m$unit$rotate$scale, _m$unit$scale;

            context.setLineDash([]);
            var points = this.attr('points');
            var line = points.slice(-2);
            var vector = [line[0][0] - line[1][0], line[0][1] - line[1][1]];
            var m = new Matrix();
            var len = Math.max(0.001, Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2)));
            var scale = arrowSize / len;
            var pv1 = (_m$rotate$scale = m.rotate(30).scale(scale, scale)).transformVector.apply(_m$rotate$scale, vector);
            var pv2 = (_m$unit$rotate$scale = m.unit().rotate(-30).scale(scale, scale)).transformVector.apply(_m$unit$rotate$scale, vector);
            var pv3 = (_m$unit$scale = m.unit().scale(1 + 3 / len, 1 + 3 / len)).transformVector.apply(_m$unit$scale, vector);
            var x = line[0][0] - pv3[0],
                y = line[0][1] - pv3[1];

            var _d = 'M' + x + ',' + y + 'L' + (x + pv1[0]) + ',' + (y + pv1[1]) + 'L' + (x + pv2[0]) + ',' + (y + pv2[1]) + 'z';
            // console.log(d);
            var p = new Path2D(_d);
            context.fillStyle = this.attr('strokeColor');
            context.fill(p);
          }
        } else {
          var _arrowSize = this.attr('arrowSize');
          if (_arrowSize > 0) {
            var _m$unit$rotate$scale2, _m$unit$rotate$scale3;

            var _points = this.attr('points');
            var _line = _points.slice(-2);
            var _vector = [_line[0][0] - _line[1][0], _line[0][1] - _line[1][1]];
            var _m = new Matrix();
            var _len = Math.max(0.001, Math.sqrt(Math.pow(_vector[0], 2) + Math.pow(_vector[1], 2)));
            var _scale = _arrowSize / _len;
            var _pv = (_m$unit$rotate$scale2 = _m.unit().rotate(30).scale(_scale, _scale)).transformVector.apply(_m$unit$rotate$scale2, _vector);
            var _pv2 = (_m$unit$rotate$scale3 = _m.unit().rotate(-30).scale(_scale, _scale)).transformVector.apply(_m$unit$rotate$scale3, _vector);

            var _line$ = (0, _slicedToArray3.default)(_line[1], 2),
                _x = _line$[0],
                _y = _line$[1];

            var _d2 = 'M' + _x + ',' + _y + 'L' + (_x + _pv[0]) + ',' + (_y + _pv[1]) + 'M' + _x + ',' + _y + 'L' + (_x + _pv2[0]) + ',' + (_y + _pv2[1]);
            context.restore();
            var options = (0, _assign2.default)({}, ret.options);
            options.lineDash = [];
            if (!this.generators[_path]) {
              this.generators[_path] = ret.context.generator.path(_d2, options);
            }
            ret.context.draw(this.generators[_path]);
            context.save();
          }
        }
        return ret;
      }
    }, {
      key: 'label',
      get: function get() {
        return this.attr('label');
      },
      set: function set(val) {
        return this.attr('label', val);
      }
    }, {
      key: 'labelSize',
      get: function get() {
        var label = this.attr('label');
        if (!label) return [0, 0];
        var font = this.attr('font');
        var width = 0;
        var context = this.context;
        if (context) {
          context.save();
          context.font = font;
          width = this.context.measureText(label).width;
          context.restore();
        }

        var _utils$parseFont = utils.parseFont(font),
            size = _utils$parseFont.size;

        return [width + 12, size + 12];
      }
    }]);
    return DagreEdge;
  }(BaseEdge), _class2.Attr = DagreEdgeAttr, _temp);


  var effect = Effects.arrayEffect;

  DagreEdge.setAttributeEffects({
    points: function points(path1, path2, p, start, end) {
      var len = Math.max(path1.length, path2.length);
      var ret = [];
      for (var i = 0; i < len; i++) {
        var p1 = path1[Math.min(i, path1.length - 1)],
            p2 = path2[Math.min(i, path2.length - 1)];
        ret.push(effect(p1, p2, p, start, end));
      }
      return ret.slice(0, path2.length);
    }
  });

  registerNodeType('dagreEdge', DagreEdge);

  return { DagreEdge: DagreEdge };
}