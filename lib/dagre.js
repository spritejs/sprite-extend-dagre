'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = install;

var _edge = require('./edge');

var _edge2 = _interopRequireDefault(_edge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _applyDecoratedDescriptor = require('babel-decorators-runtime');

function parseNodes(nodes) {
  if (typeof nodes === 'string') nodes = nodes.split('\n').map(function (v) {
    return v.trim();
  });
  var rules = [];

  nodes.forEach(function (node) {
    var nodeExp = /^([^([<>/\])!:]+)(\s*(.+))?$/;
    var matched = node.match(nodeExp);
    var nodeData = null;
    var nodeRule = {};
    if (matched) {
      nodeRule.id = matched[1];
      nodeData = matched[2] || '[' + matched[1] + ']';
    } else {
      matched = node.match(/^[([<>/\])]+([^([<>/\])]+)[([<>/\])]+$/);
      if (matched) {
        nodeRule.id = matched[1];
        nodeData = node;
      }
    }

    if (nodeData) {
      if (nodeData.indexOf('!') === 0) {
        nodeRule.type = nodeData.slice(1);
        nodeRule.userNode = true;
      } else if (/^\(\(.+\)\)$/.test(nodeData)) {
        nodeRule.type = 'ellipse';
        nodeRule.label = nodeData.slice(2, -2);
      } else if (/^\(.+\)$/.test(nodeData)) {
        nodeRule.type = 'roundedrect';
        nodeRule.label = nodeData.slice(1, -1);
      } else if (/^\[.+\]$/.test(nodeData)) {
        nodeRule.type = 'rectangle';
        nodeRule.label = nodeData.slice(1, -1);
      } else if (/^<.+>$/.test(nodeData)) {
        nodeRule.type = 'rhombus';
        nodeRule.label = nodeData.slice(1, -1);
      } else if (/^\/.+\/$/.test(nodeData)) {
        nodeRule.type = 'parallel';
        nodeRule.label = nodeData.slice(1, -1);
      } else {
        throw new Error('unknown node type.');
      }
      rules.push(nodeRule);
    }
  });
  return rules;
}

function proceed(preToken, edge, edgeRule, edges) {
  if (!preToken || edge.indexOf(preToken) === 0) {
    edge = edge.replace(preToken, '');
    if (/^--|~~|->|~>/.test(edge)) {
      edges.push(edgeRule.connection[1] + edge);
    }
  } else {
    throw new Error('Parser proceed error: ' + edge);
  }
}

function parseEdges(edges) {
  if (typeof edges === 'string') edges = edges.split('\n').map(function (v) {
    return v.trim();
  });
  var rules = [];

  for (var i = 0; i < edges.length; i++) {
    var edge = edges[i];
    var edgeRule = { arrow: false, lineStyle: 'solid' };
    var jointExp = /^([^\s~\->{}]+)(--|~~|->|~>)([^\s~\->{}]+)/;
    var matched = edge.match(jointExp);
    if (matched) {
      edgeRule.connection = [matched[1], matched[3]];
      edgeRule.id = edgeRule.connection.join();
      var type = matched[2];
      if (type === '~>' || type === '->') {
        edgeRule.arrow = true;
      }
      if (type === '~>' || type === '~~') {
        edgeRule.lineStyle = 'dashed';
      }
      edge = edge.replace(jointExp, '').trim();

      if (edge.indexOf('{') === 0) {
        // {...}
        edge = edge.slice(1);
        var labelTextExp = /^('[^']+'|"[^"]+"|[^\s~\->{}]+)/;
        matched = edge.match(labelTextExp);
        if (matched) {
          edgeRule.labelText = matched[1].replace(/^['"]|['"]$/g, '');
        }
        edge = edge.replace(labelTextExp, '').trim();
        var colorExp = /^([^\s~\->{}]+)(?:\s+([\d.]+(px|pt|pc|in|cm|mm|em|ex|rem|q|vw|vh|vmax|vmin|%)?))?/;
        matched = edge.match(colorExp);
        if (matched) {
          edgeRule.labelColor = matched[1];
          if (matched[2]) edgeRule.fontSize = matched[2];
          edge = edge.replace(colorExp, '').trim();
        }
        proceed('}', edge, edgeRule, edges);
      } else {
        proceed('', edge, edgeRule, edges);
      }
      rules.push(edgeRule);
    }
  }
  return rules;
}

function install(_ref) {
  var _dec, _dec2, _dec3, _dec4, _dec5, _desc, _value, _class, _class2, _temp;

  var use = _ref.use,
      utils = _ref.utils,
      registerNodeType = _ref.registerNodeType,
      Group = _ref.Group,
      BaseSprite = _ref.BaseSprite,
      createNode = _ref.createNode;
  var attr = utils.attr,
      parseValue = utils.parseValue;

  var _use = use(_edge2.default),
      DagreEdge = _use.DagreEdge;

  var DagreAttr = (_dec = parseValue(parseFloat), _dec2 = parseValue(parseFloat), _dec3 = parseValue(parseFloat), _dec4 = parseValue(parseFloat), _dec5 = parseValue(parseInt), (_class = function (_Group$Attr) {
    (0, _inherits3.default)(DagreAttr, _Group$Attr);

    function DagreAttr(subject) {
      (0, _classCallCheck3.default)(this, DagreAttr);

      var _this = (0, _possibleConstructorReturn3.default)(this, (DagreAttr.__proto__ || (0, _getPrototypeOf2.default)(DagreAttr)).call(this, subject));

      _this.setDefault({
        display: 'dagre',
        rankdir: 'TB', // TB, BT, LR, or RL
        align: 'UR', // UL, UR, DL, or DR
        nodesep: 120,
        edgesep: 30,
        ranksep: 120,
        clipOverflow: false,
        ranker: 'network-simplex',
        transition: 0,
        labelPos: 'center',
        labelOffset: 10
      });
      return _this;
    }

    (0, _createClass3.default)(DagreAttr, [{
      key: 'transition',
      set: function set(val) {
        this.set('transition', val);
      }
    }, {
      key: 'align',
      set: function set(val) {
        this.subject.clearLayout();
        this.set('align', val);
      }
    }, {
      key: 'rankdir',
      set: function set(val) {
        this.subject.clearLayout();
        this.set('rankdir', val);
      }
    }, {
      key: 'nodesep',
      set: function set(val) {
        this.subject.clearLayout();
        this.set('nodesep', val);
      }
    }, {
      key: 'edgesep',
      set: function set(val) {
        this.subject.clearLayout();
        this.set('edgesep', val);
      }
    }, {
      key: 'ranksep',
      set: function set(val) {
        this.subject.clearLayout();
        this.set('ranksep', val);
      }

      /*
        Type of algorithm to assigns a rank to each node in the input graph.
        Possible values: network-simplex, tight-tree or longest-path
      */

    }, {
      key: 'ranker',
      set: function set(val) {
        this.subject.clearLayout();
        this.set('ranker', val);
      }
    }, {
      key: 'labelPos',
      set: function set(val) {
        this.subject.clearLayout();
        this.set('labelPos', val);
      }
    }, {
      key: 'labelOffset',
      set: function set(val) {
        this.subject.clearLayout();
        this.set('labelOffset', val);
      }
    }]);
    return DagreAttr;
  }(Group.Attr), (_applyDecoratedDescriptor(_class.prototype, 'transition', [_dec, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'transition'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'align', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'align'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'rankdir', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'rankdir'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'nodesep', [_dec2, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'nodesep'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'edgesep', [_dec3, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'edgesep'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'ranksep', [_dec4, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'ranksep'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'ranker', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'ranker'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'labelPos', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'labelPos'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'labelOffset', [_dec5, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'labelOffset'), _class.prototype)), _class));


  var _init = (0, _symbol2.default)('init');
  var dagreLayout = {
    relayout: function relayout(group, items) {
      var dagre = require('dagre');
      var g = new dagre.graphlib.Graph();
      var _group$attributes = group.attributes,
          rankdir = _group$attributes.rankdir,
          align = _group$attributes.align,
          nodesep = _group$attributes.nodesep,
          edgesep = _group$attributes.edgesep,
          ranksep = _group$attributes.ranksep,
          margin = _group$attributes.margin,
          ranker = _group$attributes.ranker;

      g.setGraph({
        rankdir: rankdir,
        align: align,
        nodesep: nodesep,
        edgesep: edgesep,
        ranksep: ranksep,
        marginx: margin[0],
        marginy: margin[1],
        ranker: ranker
      });
      g.setDefaultEdgeLabel(function () {});

      items.forEach(function (item, idx) {
        var type = item.nodeType;
        if (type === 'dagreedge') {
          var connection = item.attr('connection');
          if (connection) {
            if (group.getElementById(connection[0]) && group.getElementById(connection[1])) {
              var label = item.attr('label');
              item.id = item.id || 'edge' + idx + '_' + Math.random().toString(36).slice(2);

              var _item$labelSize = (0, _slicedToArray3.default)(item.labelSize, 2),
                  width = _item$labelSize[0],
                  height = _item$labelSize[1];

              var labelPos = item.attr('labelPos');
              var labelOffset = item.attr('labelOffset');

              g.setEdge.apply(g, (0, _toConsumableArray3.default)(connection).concat([{ label: label, id: item.id, width: width, height: height, labelpos: labelPos[0].toLowerCase(), labeloffset: labelOffset }]));
            }
          } else {
            throw new Error('Edge:' + item.id + ' no connection.');
          }
        } else {
          var _item$offsetSize = (0, _slicedToArray3.default)(item.offsetSize, 2),
              _width = _item$offsetSize[0],
              _height = _item$offsetSize[1];

          item.attr('anchor', 0.5);
          var _label = item.attr('label');
          item.id = item.id || 'node' + idx + '_' + Math.random().toString(36).slice(2);
          g.setNode(item.id, { label: _label, width: _width, height: _height });
        }
      });

      dagre.layout(g);

      var transition = group.attr('transition');
      g.nodes().forEach(function (v) {
        var node = group.getElementById(v);
        if (node) {
          v = g.node(v);
          if (group[_init] && transition) {
            node.transition(transition, 'ease-in').attr({ layoutX: v.x, layoutY: v.y });
          } else {
            node.attr({ layoutX: v.x, layoutY: v.y });
          }
        }
      });

      g.edges().forEach(function (v) {
        var _g$edge = g.edge(v),
            id = _g$edge.id,
            points = _g$edge.points,
            label = _g$edge.label,
            x = _g$edge.x,
            y = _g$edge.y;

        var edge = group.getElementById(id);
        if (edge) {
          if (label) {
            edge.attr({ labelX: x, labelY: y });
          }
          edge.attr('points', points.map(function (_ref2) {
            var x = _ref2.x,
                y = _ref2.y;
            return [x, y];
          }));
        }
      });

      group.graph = g;
      group[_init] = true;
    }
  };

  function setGraphAttr(g, v) {
    if (v === 'TB' || v === 'BT' || v === 'LR' || v === 'RL') {
      g.attr('rankdir', v);
    } else if (v === 'UL' || v === 'UR' || v === 'DL' || v === 'DR') {
      g.attr('align', v);
    }
  }

  var Dagre = (_temp = _class2 = function (_Group) {
    (0, _inherits3.default)(Dagre, _Group);

    function Dagre() {
      var _ref3;

      (0, _classCallCheck3.default)(this, Dagre);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this2 = (0, _possibleConstructorReturn3.default)(this, (_ref3 = Dagre.__proto__ || (0, _getPrototypeOf2.default)(Dagre)).call.apply(_ref3, [this].concat(args)));

      _this2[_init] = false;
      return _this2;
    }

    (0, _createClass3.default)(Dagre, [{
      key: 'relayout',
      value: function relayout() {
        var display = this.attr('display');
        if (display === 'dagre') {
          var items = this.childNodes.filter(function (child) {
            return child.attr('display') !== 'none';
          });
          dagreLayout.relayout(this, items);
        } else {
          (0, _get3.default)(Dagre.prototype.__proto__ || (0, _getPrototypeOf2.default)(Dagre.prototype), 'relayout', this).call(this);
        }
      }
    }, {
      key: 'layoutGraph',
      value: function layoutGraph(code, userNodes) {
        var _this3 = this;

        this[_init] = false;
        this.clear();
        var lines = code.split('\n').map(function (v) {
          return v.trim();
        });
        var edges = [];
        var nodes = [];
        lines.forEach(function (line) {
          var jointExp = /^([^\s~\->]+)(--|~~|->|~>)([^\s~\->]+)?/;
          if (jointExp.test(line)) {
            edges.push(line);
          } else if (line.indexOf(';') === 0) {
            /* command */
          } else if (line.indexOf('graph ') === 0) {
            /* graph config */
            var c = line.split(/\s+/g);
            setGraphAttr(_this3, c[1]);
            setGraphAttr(_this3, c[2]);
          } else {
            nodes.push(line);
          }
        });
        this.addNodes(nodes, userNodes);
        this.addEdges(edges);
      }
    }, {
      key: 'getEdge',
      value: function getEdge(v, w) {
        return this.querySelector('dagreedge[connection="[' + v + ', ' + w + ']"]');
      }
    }, {
      key: 'addNodes',
      value: function addNodes(str, userNodes) {
        var _this4 = this;

        var nodes = parseNodes(str);
        if (nodes) {
          nodes.forEach(function (node) {
            var el = null;
            if (node.userNode) {
              el = userNodes[node.type](node);
            } else {
              el = createNode('dagre' + node.type, {
                id: node.id,
                shape: node.type,
                label: node.label
              });
            }
            if (el) {
              _this4.append(el);
            }
          });
        }
      }

      // {connection, arrow, lineStyle, labelText, labelColor, fontSize}

    }, {
      key: 'addEdges',
      value: function addEdges(str) {
        var _this5 = this;

        var edges = parseEdges(str);
        if (edges) {
          edges.forEach(function (edge) {
            var edgeNode = _this5.getEdge.apply(_this5, (0, _toConsumableArray3.default)(edge.connection));
            if (!edgeNode) {
              edgeNode = new DagreEdge();
              _this5.append(edgeNode);
            }
            var arrow = edge.arrow,
                connection = edge.connection,
                fontSize = edge.fontSize,
                labelColor = edge.labelColor,
                labelText = edge.labelText,
                lineStyle = edge.lineStyle;

            var arrowSize = arrow ? 'inherit' : 0;

            edgeNode.attr({
              arrowSize: arrowSize,
              connection: connection
            });

            if (fontSize) {
              edgeNode.attr({ fontSize: fontSize });
            }
            edgeNode.attr({ label: labelText || ' ' });
            if (labelColor) {
              edgeNode.attr({ labelColor: labelColor });
            }
            if (lineStyle === 'dashed') {
              var lineWidth = edgeNode.attr('lineWidth');
              edgeNode.attr({ lineDash: [Math.max(5, 2 * lineWidth), Math.max(10, 3 * lineWidth)] });
            }

            var _edge$connection = (0, _slicedToArray3.default)(edge.connection, 2),
                node1 = _edge$connection[0],
                node2 = _edge$connection[1];

            if (!_this5.getElementById(node1)) {
              var node = createNode('dagrerectangle');
              node.id = node1;
              node.label = node1;
              _this5.append(node);
            }
            if (!_this5.getElementById(node2)) {
              var _node = createNode('dagrerectangle');
              _node.id = node2;
              _node.label = node2;
              _this5.append(_node);
            }
          });
        }
      }
    }]);
    return Dagre;
  }(Group), _class2.Attr = DagreAttr, _temp);


  registerNodeType('dagre', Dagre);

  return { Dagre: Dagre };
}