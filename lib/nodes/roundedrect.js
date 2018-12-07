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

  var DagreRoundedrect = function (_DagreNode) {
    (0, _inherits3.default)(DagreRoundedrect, _DagreNode);

    function DagreRoundedrect() {
      (0, _classCallCheck3.default)(this, DagreRoundedrect);
      return (0, _possibleConstructorReturn3.default)(this, (DagreRoundedrect.__proto__ || (0, _getPrototypeOf2.default)(DagreRoundedrect)).apply(this, arguments));
    }

    (0, _createClass3.default)(DagreRoundedrect, [{
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
          return [generator.arc(x + r, y + r, 2 * r, 2 * r, Math.PI, 1.5 * Math.PI, false, options), generator.line(x + r, y, w - r, y, options), generator.arc(w - r, y + r, 2 * r, 2 * r, 1.5 * Math.PI, 2 * Math.PI, false, options), generator.line(w, y + r, w, h - r, options), generator.arc(w - r, h - r, 2 * r, 2 * r, 0, 0.5 * Math.PI, false, options), generator.line(w - r, h, x + r, h, options), generator.arc(x + r, h - r, 2 * r, 2 * r, 0.5 * Math.PI, Math.PI, false, options), generator.line(x, h - r, x, y + r, options)];
        }
        context.moveTo(x + r, y);
        context.arcTo(x + w, y, x + w, y + h, r);
        context.arcTo(x + w, y + h, x, y + h, r);
        context.arcTo(x, y + h, x, y, r);
        context.arcTo(x, y, x + w, y, r);
        context.closePath();
      }
    }]);
    return DagreRoundedrect;
  }(DagreNode);

  registerNodeType('dagreRoundedrect', DagreRoundedrect);

  return { DagreRoundedrect: DagreRoundedrect };
}