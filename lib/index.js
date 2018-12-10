'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.install = install;

var _dagre = require('./dagre');

var _dagre2 = _interopRequireDefault(_dagre);

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

var _edge = require('./edge');

var _edge2 = _interopRequireDefault(_edge);

var _rectangle = require('./nodes/rectangle');

var _rectangle2 = _interopRequireDefault(_rectangle);

var _roundedrect = require('./nodes/roundedrect');

var _roundedrect2 = _interopRequireDefault(_roundedrect);

var _ellispe = require('./nodes/ellispe');

var _ellispe2 = _interopRequireDefault(_ellispe);

var _rhombus = require('./nodes/rhombus');

var _rhombus2 = _interopRequireDefault(_rhombus);

var _parallel = require('./nodes/parallel');

var _parallel2 = _interopRequireDefault(_parallel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// auto use
if (typeof window !== 'undefined' && window.spritejs) {
  window.spritejs.use(install);
}

function install(_ref) {
  var use = _ref.use;

  return [_dagre2.default, _node2.default, _edge2.default, _rectangle2.default, _roundedrect2.default, _ellispe2.default, _rhombus2.default, _parallel2.default].reduce(function (pkg, Node) {
    return (0, _assign2.default)(pkg, spritejs.use(Node));
  }, {});
}