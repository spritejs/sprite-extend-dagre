'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _get4 = require('babel-runtime/helpers/get');

var _get5 = _interopRequireDefault(_get4);

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

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = install;

var _path = require('./path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _applyDecoratedDescriptor = require('babel-decorators-runtime');

function install(_ref) {
  var _dec, _desc, _value, _class, _desc2, _value2, _class2, _class3, _temp;

  var __spritejs = _ref.__spritejs,
      use = _ref.use,
      utils = _ref.utils,
      registerNodeType = _ref.registerNodeType;

  var _use = use(_path2.default),
      DagrePath = _use.DagrePath;

  var BaseNode = __spritejs.Rough ? __spritejs.Rough : DagrePath;
  var flow = utils.flow,
      attr = utils.attr,
      inherit = utils.inherit,
      parseFont = utils.parseFont;
  var DagreNodeAttr = (_dec = inherit('rectangle'), (_class = function (_BaseNode$Attr) {
    (0, _inherits3.default)(DagreNodeAttr, _BaseNode$Attr);

    function DagreNodeAttr(subject) {
      (0, _classCallCheck3.default)(this, DagreNodeAttr);

      var _this = (0, _possibleConstructorReturn3.default)(this, (DagreNodeAttr.__proto__ || (0, _getPrototypeOf2.default)(DagreNodeAttr)).call(this, subject));

      _this.setDefault({
        // width: 200,
        // height: 120,
        shape: 'inherit', // rectangle, roundedrect, parallel, ellispe, rhombus
        anchor: [0.5, 0.5]
      });
      return _this;
    }

    (0, _createClass3.default)(DagreNodeAttr, [{
      key: 'shape',
      set: function set(val) {
        this.set('shape', val);
      }
    }]);
    return DagreNodeAttr;
  }(BaseNode.Attr), (_applyDecoratedDescriptor(_class.prototype, 'shape', [attr, _dec], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'shape'), _class.prototype)), _class));


  var _node = (0, _symbol2.default)('node');

  var DagreNode = (_class2 = (_temp = _class3 = function (_BaseNode) {
    (0, _inherits3.default)(DagreNode, _BaseNode);

    function DagreNode() {
      (0, _classCallCheck3.default)(this, DagreNode);
      return (0, _possibleConstructorReturn3.default)(this, (DagreNode.__proto__ || (0, _getPrototypeOf2.default)(DagreNode)).apply(this, arguments));
    }

    (0, _createClass3.default)(DagreNode, [{
      key: 'drawShape',
      value: function drawShape(context, width, height) {
        /* implement by subclass */
      }
    }, {
      key: 'render',
      value: function render(t, context) {
        var _this3 = this;

        var ret = (0, _get5.default)(DagreNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(DagreNode.prototype), 'render', this).call(this, t, context);
        context.save();
        var lw = this.attr('lineWidth') / 2;
        context.translate(lw, lw);

        var _contentSize = (0, _slicedToArray3.default)(this.contentSize, 2),
            width = _contentSize[0],
            height = _contentSize[1];

        if (this instanceof DagrePath) {
          context.beginPath();
          this.drawShape(context, width, height);
          context.stroke();
          var fillColor = this.attr('fillColor');
          if (fillColor) {
            context.fillStyle = fillColor;
            context.fill();
          }
          var label = this.attr('label');
          if (label) {
            this.once('afterdraw', function (_ref2) {
              var context = _ref2.context;

              _this3.renderLabel(label, context);
            });
          }
        } else {
          if (!this.generators[_node]) {
            this.generators[_node] = this.drawShape(ret, width, height);
          }
          if (Array.isArray(this.generators[_node])) {
            this.generators[_node].forEach(function (n) {
              return ret.context.draw(n);
            });
          } else {
            ret.context.draw(this.generators[_node]);
          }
        }

        context.restore();
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
    }, {
      key: 'contentSize',
      get: function get() {
        var _attrSize = (0, _slicedToArray3.default)(this.attrSize, 2),
            width = _attrSize[0],
            height = _attrSize[1];

        if (width === '' || height === '') {
          var label = this.attr('label');
          if (label) {
            var font = this.attr('font');
            var context = this.context;
            if (context) {
              var _parseFont = parseFont(font),
                  h = _parseFont.size;

              context.save();
              context.font = font;

              var _context$measureText = context.measureText(label),
                  w = _context$measureText.width;

              context.restore();
              if (height === '') height = h * 3.5;
              if (width === '') width = Math.max(height, w * 2);
            }
          }
          if (width === '') width = 0;
          if (height === '') height = 0;
        } else {
          var _get2 = (0, _get5.default)(DagreNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(DagreNode.prototype), 'contentSize', this);

          var _get3 = (0, _slicedToArray3.default)(_get2, 2);

          width = _get3[0];
          height = _get3[1];
        }
        var lineWidth = this.attr('lineWidth');
        return [width + lineWidth, height + lineWidth];
      }
    }]);
    return DagreNode;
  }(BaseNode), _class3.Attr = DagreNodeAttr, _temp), (_applyDecoratedDescriptor(_class2.prototype, 'contentSize', [flow], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'contentSize'), _class2.prototype)), _class2);


  return { DagreNode: DagreNode };
}