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

  var DagreEllispe = function (_DagreNode) {
    (0, _inherits3.default)(DagreEllispe, _DagreNode);

    function DagreEllispe() {
      (0, _classCallCheck3.default)(this, DagreEllispe);
      return (0, _possibleConstructorReturn3.default)(this, (DagreEllispe.__proto__ || (0, _getPrototypeOf2.default)(DagreEllispe)).apply(this, arguments));
    }

    (0, _createClass3.default)(DagreEllispe, [{
      key: 'drawShape',
      value: function drawShape(context, width, height) {
        if (context.context) {
          var generator = context.context.generator;
          var options = context.options;
          return generator.ellipse(width / 2, height / 2, width, height, options);
        }
        context.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
      }
    }]);
    return DagreEllispe;
  }(DagreNode);

  registerNodeType('dagreEllispe', DagreEllispe);

  return { DagreEllispe: DagreEllispe };
}