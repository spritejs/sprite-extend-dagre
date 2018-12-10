import EdgePlugin from './edge';

function parseNodes(nodes) {
  if(typeof nodes === 'string') nodes = nodes.split('\n').map(v => v.trim());
  const rules = [];

  nodes.forEach((node) => {
    const nodeExp = /^([^([<>/\])!:]+)\s*(.+)$/;
    let matched = node.match(nodeExp);
    let nodeData = null;
    const nodeRule = {};
    if(matched) {
      nodeRule.id = matched[1];
      nodeData = matched[2];
    } else {
      matched = node.match(/^[([<>/\])]+([^([<>/\])]+)[([<>/\])]+$/);
      if(matched) {
        nodeRule.id = matched[1];
        nodeData = node;
      }
    }

    if(nodeData) {
      if(nodeData.indexOf('!') === 0) {
        nodeRule.type = nodeData.slice(1);
        nodeRule.userNode = true;
      } else if(/^\(\(.+\)\)$/.test(nodeData)) {
        nodeRule.type = 'ellispe';
        nodeRule.label = nodeData.slice(2, -2);
      } else if(/^\(.+\)$/.test(nodeData)) {
        nodeRule.type = 'roundedrect';
        nodeRule.label = nodeData.slice(1, -1);
      } else if(/^\[.+\]$/.test(nodeData)) {
        nodeRule.type = 'rectangle';
        nodeRule.label = nodeData.slice(1, -1);
      } else if(/^<.+>$/.test(nodeData)) {
        nodeRule.type = 'rhombus';
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

function proceed(preToken, edge, edgeRule, edges) {
  if(!preToken || edge.indexOf(preToken) === 0) {
    edge = edge.replace(preToken, '');
    if(/^--|~~|->|~>/.test(edge)) {
      edges.push(edgeRule.connection[1] + edge);
    }
  } else {
    throw new Error(`Parser proceed error: ${edge}`);
  }
}

function parseEdges(edges) {
  if(typeof edges === 'string') edges = edges.split('\n').map(v => v.trim());
  const rules = [];

  for(let i = 0; i < edges.length; i++) {
    let edge = edges[i];
    const edgeRule = {arrow: false, lineStyle: 'solid'};
    const jointExp = /^([^\s~\->{}]+)(--|~~|->|~>)([^\s~\->{}]+)/;
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

      if(edge.indexOf('{') === 0) { // {...}
        edge = edge.slice(1);
        const labelTextExp = /^('[^']+'|"[^"]+"|[^\s~\->{}]+)/;
        matched = edge.match(labelTextExp);
        if(matched) {
          edgeRule.labelText = matched[1].replace(/^['"]|['"]$/g, '');
        }
        edge = edge.replace(labelTextExp, '').trim();
        const colorExp = /^([^\s~\->{}]+)(?:\s+([\d.]+(px|pt|pc|in|cm|mm|em|ex|rem|q|vw|vh|vmax|vmin|%)?))?/;
        matched = edge.match(colorExp);
        if(matched) {
          edgeRule.labelColor = matched[1];
          if(matched[2]) edgeRule.fontSize = matched[2];
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

export default function install({use, utils, registerNodeType, Group, BaseSprite, createNode}) {
  const {attr, parseValue} = utils;
  const {DagreEdge} = use(EdgePlugin);

  class DagreAttr extends Group.Attr {
    constructor(subject) {
      super(subject);
      this.setDefault({
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
        labelOffset: 10,
      });
    }

    @parseValue(parseFloat)
    @attr
    set transition(val) {
      this.set('transition', val);
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
          const connection = item.attr('connection');
          if(connection) {
            if(group.getElementById(connection[0]) && group.getElementById(connection[1])) {
              const label = item.attr('label');
              item.id = item.id || `edge${idx}_${Math.random().toString(36).slice(2)}`;
              const [width, height] = item.labelSize;
              const labelPos = item.attr('labelPos');
              const labelOffset = item.attr('labelOffset');

              g.setEdge(...connection, {label, id: item.id, width, height, labelpos: labelPos[0].toLowerCase(), labeloffset: labelOffset});
            }
          } else {
            throw new Error(`Edge:${item.id} no connection.`);
          }
        } else {
          const [width, height] = item.offsetSize;
          item.attr('anchor', 0.5);
          const label = item.attr('label');
          item.id = item.id || `node${idx}_${Math.random().toString(36).slice(2)}`;
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

      group.graph = g;
      group[_init] = true;
    },
  };

  function setGraphAttr(g, v) {
    if(v === 'TB' || v === 'BT' || v === 'LR' || v === 'RL') {
      g.attr('rankdir', v);
    } else if(v === 'UL' || v === 'UR' || v === 'DL' || v === 'DR') {
      g.attr('align', v);
    }
  }

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

    layoutGraph(code, userNodes) {
      this[_init] = false;
      this.clear();
      const lines = code.split('\n').map(v => v.trim());
      const edges = [];
      const nodes = [];
      lines.forEach((line) => {
        const jointExp = /^([^\s~\->]+)(--|~~|->|~>)([^\s~\->]+)?/;
        if(jointExp.test(line)) {
          edges.push(line);
        } else if(line.indexOf(';') === 0) {
          /* command */
        } else if(line.indexOf('graph ') === 0) {
          /* graph config */
          const c = line.split(/\s+/g);
          setGraphAttr(this, c[1]);
          setGraphAttr(this, c[2]);
        } else {
          nodes.push(line);
        }
      });
      this.addNodes(nodes, userNodes);
      this.addEdges(edges);
    }

    getEdge(v, w) {
      return this.querySelector(`dagreedge[connection="[${v}, ${w}]"]`);
    }

    addNodes(str, userNodes) {
      const nodes = parseNodes(str);
      if(nodes) {
        nodes.forEach((node) => {
          let el = null;
          if(node.userNode) {
            el = userNodes[node.type](node);
          } else {
            el = createNode(`dagre${node.type}`, {
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
    addEdges(str) {
      const edges = parseEdges(str);
      if(edges) {
        edges.forEach((edge) => {
          let edgeNode = this.getEdge(...edge.connection);
          if(!edgeNode) {
            edgeNode = new DagreEdge();
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
            edgeNode.attr({lineDash: [Math.max(5, 2 * lineWidth), Math.max(10, 3 * lineWidth)]});
          }

          const [node1, node2] = edge.connection;
          if(!this.getElementById(node1)) {
            const node = createNode('dagrerectangle');
            node.id = node1;
            node.label = node1;
            this.append(node);
          }
          if(!this.getElementById(node2)) {
            const node = createNode('dagrerectangle');
            node.id = node2;
            node.label = node2;
            this.append(node);
          }
        });
      }
    }
  }

  registerNodeType('dagre', Dagre);

  return {Dagre};
}
