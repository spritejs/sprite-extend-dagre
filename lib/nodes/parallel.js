'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = install;

var _node = require('../node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function install(_ref) {
  var __spritejs = _ref.__spritejs,
      use = _ref.use,
      utils = _ref.utils,
      registerNodeType = _ref.registerNodeType;

  var _use = use(_node2.default),
      DagreNode = _use.DagreNode;

  var DagreParallel = function (_DagreNode) {
    (0, _inherits3.default)(DagreParallel, _DagreNode);

    function DagreParallel() {
      (0, _classCallCheck3.default)(this, DagreParallel);
      return (0, _possibleConstructorReturn3.default)(this, (DagreParallel.__proto__ || (0, _getPrototypeOf2.default)(DagreParallel)).apply(this, arguments));
    }

    (0, _createClass3.default)(DagreParallel, [{
      key: 'drawShape',
      value: function drawShape(context, width, height) {
        var x = 0,
            y = 0,
            w = width,
            h = height,
            r = Math.min(w, h) / 4;

        if (context.context) {
          var generator = context.context.generator;
          var options = context.options;
          return [generator.line(x + r, y, x + w, y, options), generator.line(x + w, y, x + w - r, y + h, options), generator.line(x + w - r, y + h, x, y + h, options), generator.line(x, y + h, x + r, y, options)];
        }
        context.moveTo(x + r, y);
        context.lineTo(x + w, y);
        context.lineTo(x + w - r, y + h);
        context.lineTo(x, y + h);
        context.closePath();
      }
    }]);
    return DagreParallel;
  }(DagreNode);

  registerNodeType('dagreParallel', DagreParallel);

  return { DagreParallel: DagreParallel };
}