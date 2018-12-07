'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _applyDecoratedDescriptor = require('babel-decorators-runtime');

function install(_ref) {
  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _desc, _value, _class, _class2, _temp;

  var __spritejs = _ref.__spritejs,
      use = _ref.use,
      utils = _ref.utils,
      registerNodeType = _ref.registerNodeType,
      Path = _ref.Path;
  var attr = utils.attr,
      parseValue = utils.parseValue,
      parseStringFloat = utils.parseStringFloat,
      inherit = utils.inherit,
      parseColorString = utils.parseColorString,
      parseFont = utils.parseFont;


  var defaultFont = 'normal normal normal 32px Arial';
  if (__spritejs.Rough) defaultFont = 'normal normal normal 32px "Hannotate SC"';

  var DagrePathAttr = (_dec = parseValue(parseColorString), _dec2 = inherit(''), _dec3 = parseValue(parseColorString), _dec4 = inherit('rgba(0,0,0,1)'), _dec5 = inherit(defaultFont), _dec6 = parseValue(parseFloat), _dec7 = parseValue(parseFloat), _dec8 = parseValue(parseStringFloat), (_class = function (_Path$Attr) {
    (0, _inherits3.default)(DagrePathAttr, _Path$Attr);

    function DagrePathAttr(subject) {
      (0, _classCallCheck3.default)(this, DagrePathAttr);

      var _this = (0, _possibleConstructorReturn3.default)(this, (DagrePathAttr.__proto__ || (0, _getPrototypeOf2.default)(DagrePathAttr)).call(this, subject));

      _this.setDefault({
        bounding: 'path',
        label: '',
        labelX: '',
        labelY: '',
        font: 'inherit',
        labelColor: 'inherit',
        labelBg: 'inherit',
        clipOverflow: false
        // lineJoin: 'round',
        // lineCap: 'round',
      });
      return _this;
    }

    (0, _createClass3.default)(DagrePathAttr, [{
      key: 'labelBg',
      set: function set(val) {
        this.set('labelBg', val);
      }
    }, {
      key: 'labelColor',
      set: function set(val) {
        this.set('labelColor', val);
      }
    }, {
      key: 'font',
      set: function set(val) {
        this.set('font', val);
      }
    }, {
      key: 'fontSize',
      set: function set(val) {
        if (val == null) val = '16px';
        var unit = 'px';
        if (typeof val === 'string') {
          var unitReg = /^([\d.]+)(\w+)/;
          var matches = val.match(unitReg);
          if (!matches) {
            return null;
          }
          val = parseFloat(matches[1]);
          unit = matches[2];
        }
        var font = this.font;

        var _parseFont = parseFont(font),
            style = _parseFont.style,
            variant = _parseFont.variant,
            weight = _parseFont.weight,
            family = _parseFont.family;

        var fontValue = style + ' ' + variant + ' ' + weight + ' ' + val + unit + ' ' + family;
        this.font = fontValue;
      },
      get: function get() {
        var font = this.font;

        var _parseFont2 = parseFont(font),
            size0 = _parseFont2.size0,
            unit = _parseFont2.unit;

        return '' + size0 + unit;
      }
    }, {
      key: 'fontFamily',
      set: function set(val) {
        if (val == null) val = 'Arial';
        var font = this.font;

        var _parseFont3 = parseFont(font),
            style = _parseFont3.style,
            variant = _parseFont3.variant,
            weight = _parseFont3.weight,
            size0 = _parseFont3.size0,
            unit = _parseFont3.unit;

        var fontValue = style + ' ' + variant + ' ' + weight + ' ' + size0 + unit + ' ' + val;
        this.font = fontValue;
      },
      get: function get() {
        return parseFont(this.font).family;
      }
    }, {
      key: 'fontStyle',
      set: function set(val) {
        if (val == null) val = 'normal';
        var font = this.font;

        var _parseFont4 = parseFont(font),
            variant = _parseFont4.variant,
            weight = _parseFont4.weight,
            size0 = _parseFont4.size0,
            unit = _parseFont4.unit,
            family = _parseFont4.family;

        var fontValue = val + ' ' + variant + ' ' + weight + ' ' + size0 + unit + ' ' + family;
        this.font = fontValue;
      },
      get: function get() {
        return parseFont(this.font).style;
      }
    }, {
      key: 'fontVariant',
      set: function set(val) {
        if (val == null) val = 'normal';
        var font = this.font;

        var _parseFont5 = parseFont(font),
            style = _parseFont5.style,
            weight = _parseFont5.weight,
            size0 = _parseFont5.size0,
            unit = _parseFont5.unit,
            family = _parseFont5.family;

        var fontValue = style + ' ' + val + ' ' + weight + ' ' + size0 + unit + ' ' + family;
        this.font = fontValue;
      },
      get: function get() {
        return parseFont(this.font).variant;
      }
    }, {
      key: 'fontWeight',
      set: function set(val) {
        if (val == null) val = 'normal';
        var font = this.font;

        var _parseFont6 = parseFont(font),
            style = _parseFont6.style,
            variant = _parseFont6.variant,
            size0 = _parseFont6.size0,
            unit = _parseFont6.unit,
            family = _parseFont6.family;

        var fontValue = style + ' ' + variant + ' ' + val + ' ' + size0 + unit + ' ' + family;
        this.font = fontValue;
      },
      get: function get() {
        return parseFont(this.font).weight;
      }
    }, {
      key: 'labelX',
      set: function set(val) {
        this.set('labelX', val);
      }
    }, {
      key: 'labelY',
      set: function set(val) {
        this.set('labelY', val);
      }
    }, {
      key: 'labelXY',
      set: function set(val) {
        if (val == null) {
          val = ['', ''];
        }

        var _val = val,
            _val2 = (0, _slicedToArray3.default)(_val, 2),
            x = _val2[0],
            y = _val2[1];

        this.labelX = x;
        this.labelY = y;
      },
      get: function get() {
        return [this.labelX, this.labelY];
      }
    }]);
    return DagrePathAttr;
  }(Path.Attr), (_applyDecoratedDescriptor(_class.prototype, 'labelBg', [_dec, attr, _dec2], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'labelBg'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'labelColor', [_dec3, attr, _dec4], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'labelColor'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'font', [attr, _dec5], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'font'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fontSize', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fontSize'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fontFamily', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fontFamily'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fontStyle', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fontStyle'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fontVariant', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fontVariant'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fontWeight', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fontWeight'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'labelX', [_dec6, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'labelX'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'labelY', [_dec7, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'labelY'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'labelXY', [_dec8, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'labelXY'), _class.prototype)), _class));
  var DagrePath = (_temp = _class2 = function (_Path) {
    (0, _inherits3.default)(DagrePath, _Path);

    function DagrePath() {
      (0, _classCallCheck3.default)(this, DagrePath);
      return (0, _possibleConstructorReturn3.default)(this, (DagrePath.__proto__ || (0, _getPrototypeOf2.default)(DagrePath)).apply(this, arguments));
    }

    (0, _createClass3.default)(DagrePath, [{
      key: 'renderLabel',
      value: function renderLabel(label, context) {
        var rect = this.originalRect;

        var _attr = this.attr('labelXY'),
            _attr2 = (0, _slicedToArray3.default)(_attr, 2),
            cx = _attr2[0],
            cy = _attr2[1];

        var font = this.attr('font');
        context.font = font;
        context.textBaseline = 'middle';

        var _context$measureText = context.measureText(label),
            width = _context$measureText.width;

        var padding = this.attr('padding');
        if (cx === '') cx = rect[2] / 2 - padding[0];
        if (cy === '') cy = rect[3] / 2 - padding[3];
        var labelBg = this.attr('labelBg');
        if (labelBg) {
          var _parseFont7 = parseFont(font),
              size = _parseFont7.size;

          var _rect = [cx - width / 2 - 6, cy - size / 2 - 6, width + 12, size + 12];
          context.fillStyle = labelBg;
          context.beginPath();
          context.rect.apply(context, _rect);
          context.fill();
        }
        context.fillStyle = this.attr('labelColor');
        context.fillText(label, cx - width / 2, cy);
      }
    }, {
      key: 'render',
      value: function render(t, context) {
        var ret = (0, _get3.default)(DagrePath.prototype.__proto__ || (0, _getPrototypeOf2.default)(DagrePath.prototype), 'render', this).call(this, t, context);
        var lineWidth = this.attr('lineWidth');
        var strokeColor = this.attr('strokeColor');
        context.lineWidth = lineWidth;
        context.strokeStyle = strokeColor;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        return ret;
      }
    }]);
    return DagrePath;
  }(Path), _class2.Attr = DagrePathAttr, _temp);


  return { DagrePath: DagrePath };
}