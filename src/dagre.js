import EdgePlugin from './edge';
import NodePlugin from './node';

function parseNodes(str) {
  const nodes = str.split(',').map(v => v.trim());
  const rules = [];

  nodes.forEach((node) => {
    const nodeExp = /^([^:]+):(.+)$/;
    const matched = node.match(nodeExp);
    if(matched) {
      const nodeRule = {id: matched[1]};
      const nodeData = matched[2];
      if(nodeData.indexOf('!') === 0) {
        nodeRule.type = nodeData.slice(1);
        nodeRule.userNode = true;
      } else if(/^\[\(.+\)\]$/.test(nodeData)) {
        nodeRule.type = 'roundedrect';
        nodeRule.label = nodeData.slice(2, -2);
      } else if(/^\[.+\]$/.test(nodeData)) {
        nodeRule.type = 'rectangle';
        nodeRule.label = nodeData.slice(1, -1);
      } else if(/^<.+>$/.test(nodeData)) {
        nodeRule.type = 'rhombus';
        nodeRule.label = nodeData.slice(1, -1);
      } else if(/^\(.+\)$/.test(nodeData)) {
        nodeRule.type = 'ellispe';
        nodeRule.label = nodeData.slice(1, -1);
      } else if(/^\/.+\/$/.test(nodeData)) {
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

function parseEdges(val) {
  const edges = val.split(',').map(v => v.trim());
  const rules = [];
  edges.forEach((edge) => {
    const edgeRule = {arrow: false, lineStyle: 'solid'};
    const jointExp = /^(\S+)(--|~~|->|~>)(\S+)?/;
    let matched = edge.match(jointExp);
    if(matched) {
      edgeRule.connection = [matched[1], matched[3]];
      edgeRule.id = edgeRule.connection.join();
      const type = matched[2];
      if(type === '~>' || type === '->') {
        edgeRule.arrow = true;
      }
      if(type === '~>' || type === '~~') {
        edgeRule.lineStyle = 'dashed';
      }
      edge = edge.replace(jointExp, '').trim();
      if(edge) {
        const labelTextExp = /^('[^']+'|"[^"]+"|[\S]+)/;
        matched = edge.match(labelTextExp);
        if(matched) {
          edgeRule.labelText = matched[1].replace(/^['"]|['"]$/g, '');
        }
        edge = edge.replace(labelTextExp, '').trim();
        if(edge) {
          const colorExp = /^(.+)?\s+([\d.]+(px|pt|pc|in|cm|mm|em|ex|rem|q|vw|vh|vmax|vmin|%)?$)/;
          matched = edge.match(colorExp);
          if(matched) {
            edgeRule.labelColor = matched[1];
            edgeRule.fontSize = matched[2];
          } else {
            edgeRule.labelColor = edge;
          }
        }
      }
      rules.push(edgeRule);
    }
  });
  return rules;
}

export default function install({use, utils, registerNodeType, Group, BaseSprite}) {
  const {attr, parseValue, parseColorString} = utils;
  const {DagreEdge} = use(EdgePlugin);
  const {DagreNode} = use(NodePlugin);

  class DagreAttr extends Group.Attr {
    constructor(subject) {
      super(subject);
      this.setDefault({
        display: 'dagre',
        rankdir: 'TB', // TB, BT, LR, or RL
        align: 'UL', // UL, UR, DL, or DR
        nodesep: 120,
        edgesep: 30,
        ranksep: 120,
        clipOverflow: false,
        labelBg: '',
        ranker: 'network-simplex',
        transition: 0,
        labelPos: 'center',
        labelOffset: 10,
      });
    }

    @parseValue(parseFloat)
    @attr
    set transition(val) {
      this.set('transition', val);
    }

    @parseValue(parseColorString)
    @attr
    set labelBg(val) {
      this.set('labelBg', val);
    }

    get labelBg() {
      const labelBg = this.get('labelBg') || this.get('bgcolor') || 'rgba(255,255,255,1)';
      return labelBg;
    }

    @attr
    set align(val) {
      this.subject.clearLayout();
      this.set('align', val);
    }

    @attr
    set rankdir(val) {
      this.subject.clearLayout();
      this.set('rankdir', val);
    }

    @parseValue(parseFloat)
    @attr
    set nodesep(val) {
      this.subject.clearLayout();
      this.set('nodesep', val);
    }

    @parseValue(parseFloat)
    @attr
    set edgesep(val) {
      this.subject.clearLayout();
      this.set('edgesep', val);
    }

    @parseValue(parseFloat)
    @attr
    set ranksep(val) {
      this.subject.clearLayout();
      this.set('ranksep', val);
    }

    /*
      Type of algorithm to assigns a rank to each node in the input graph.
      Possible values: network-simplex, tight-tree or longest-path
    */
    @attr
    set ranker(val) {
      this.subject.clearLayout();
      this.set('ranker', val);
    }

    @attr
    set labelPos(val) {
      this.subject.clearLayout();
      this.set('labelPos', val);
    }

    @parseValue(parseInt)
    @attr
    set labelOffset(val) {
      this.subject.clearLayout();
      this.set('labelOffset', val);
    }
  }

  const _init = Symbol('init');
  const dagreLayout = {
    relayout(group, items) {
      const dagre = require('dagre');
      const g = new dagre.graphlib.Graph();
      const {rankdir, align, nodesep, edgesep, ranksep, margin, ranker} = group.attributes;
      g.setGraph({
        rankdir,
        align,
        nodesep,
        edgesep,
        ranksep,
        marginx: margin[0],
        marginy: margin[1],
        ranker,
      });
      g.setDefaultEdgeLabel(() => {});

      items.forEach((item, idx) => {
        const type = item.nodeType;
        if(type === 'dagreedge') {
          if(item.autoUpdated_ === false) {
            item.remove();
          } else {
            const connection = item.attr('connection');
            if(connection) {
              if(group.getElementById(connection[0]) && group.getElementById(connection[1])) {
                const label = item.attr('label');
                item.id = item.id || `edge${idx}_`;
                const [width, height] = item.labelSize;
                const labelPos = item.attr('labelPos');
                const labelOffset = item.attr('labelOffset');

                g.setEdge(...connection, {label, id: item.id, width, height, labelpos: labelPos[0].toLowerCase(), labeloffset: labelOffset});
              }
            } else {
              throw new Error(`Edge:${item.id} no connection.`);
            }
          }
        } else {
          const [width, height] = item.offsetSize;
          item.attr('anchor', 0.5);
          const label = item.attr('label');
          item.id = item.id || `node${idx}_`;
          g.setNode(item.id, {label, width, height});
        }
      });

      dagre.layout(g);

      const transition = group.attr('transition');
      g.nodes().forEach((v) => {
        const node = group.getElementById(v);
        if(node) {
          v = g.node(v);
          if(group[_init] && transition) {
            node.transition(transition, 'ease-in').attr({layoutX: v.x, layoutY: v.y});
          } else {
            node.attr({layoutX: v.x, layoutY: v.y});
          }
        }
      });

      g.edges().forEach((v) => {
        const {id, points, label, x, y} = g.edge(v);
        const edge = group.getElementById(id);
        if(edge) {
          if(label) {
            edge.attr({labelX: x, labelY: y});
          }
          edge.attr('points', points.map(({x, y}) => [x, y]));
        }
      });
      group[_init] = true;
    },
  };

  class Dagre extends Group {
    static Attr = DagreAttr;

    constructor(...args) {
      super(...args);
      this[_init] = false;
    }

    relayout() {
      const display = this.attr('display');
      if(display === 'dagre') {
        const items = this.childNodes.filter((child) => {
          return child.attr('display') !== 'none';
        });
        dagreLayout.relayout(this, items);
      } else {
        super.relayout();
      }
    }

    setNodes(str, userNodes) {
      const nodes = parseNodes(str);
      if(nodes) {
        nodes.forEach((node) => {
          let el = null;
          if(node.userNode) {
            el = userNodes[node.type](node);
          } else {
            el = new DagreNode({
              id: node.id,
              shape: node.type,
              label: node.label,
            });
          }
          if(el) {
            this.append(el);
          }
        });
      }
    }

    // {connection, arrow, lineStyle, labelText, labelColor, fontSize}
    setEdges(str) {
      const edges = parseEdges(str);
      if(edges) {
        edges.forEach((edge) => {
          let edgeNode = this.querySelector(`dagreedge[connection="[${edge.connection}]"]`);
          if(!edgeNode) {
            edgeNode = new DagreEdge();
            edgeNode.autoUpdated_ = true;
            this.append(edgeNode);
          }
          const {arrow, connection, fontSize, labelColor, labelText, lineStyle} = edge;
          const arrowSize = arrow ? 'inherit' : 0;

          edgeNode.attr({
            arrowSize,
            connection,
          });

          if(fontSize) {
            edgeNode.attr({fontSize});
          }
          edgeNode.attr({label: labelText || ' '});
          if(labelColor) {
            edgeNode.attr({labelColor});
          }
          if(lineStyle === 'dashed') {
            const lineWidth = edgeNode.attr('lineWidth');
            edgeNode.attr({lineDash: [2 * lineWidth, 3 * lineWidth]});
          }
        });
      }
    }
  }

  registerNodeType('dagre', Dagre);

  return {Dagre};
}
