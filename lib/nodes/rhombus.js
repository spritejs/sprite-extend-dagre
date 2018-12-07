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

  var DagreRhombus = function (_DagreNode) {
    (0, _inherits3.default)(DagreRhombus, _DagreNode);

    function DagreRhombus() {
      (0, _classCallCheck3.default)(this, DagreRhombus);
      return (0, _possibleConstructorReturn3.default)(this, (DagreRhombus.__proto__ || (0, _getPrototypeOf2.default)(DagreRhombus)).apply(this, arguments));
    }

    (0, _createClass3.default)(DagreRhombus, [{
      key: 'drawShape',
      value: function drawShape(context, width, height) {
        var x = 0,
            y = 0,
            w = width,
            h = height;
        if (context.context) {
          var generator = context.context.generator;
          var options = context.options;
          return [generator.line(x + w / 2, y, x + w, y + h / 2, options), generator.line(x + w, y + h / 2, x + w / 2, y + h, options), generator.line(x + w / 2, y + h, x, y + h / 2, options), generator.line(x, y + h / 2, x + w / 2, y, options)];
        }
        context.moveTo(x + w / 2, y);
        context.lineTo(x + w, y + h / 2);
        context.lineTo(x + w / 2, y + h);
        context.lineTo(x, y + h / 2);
        context.closePath();
      }
    }]);
    return DagreRhombus;
  }(DagreNode);

  registerNodeType('dagreRhombus', DagreRhombus);

  return { DagreRhombus: DagreRhombus };
}