import EdgePlugin from './edge';

export default function install({use, utils, registerNodeType, Group}) {
  const {attr, parseValue, parseColorString} = utils;
  const {DagreEdge} = use(EdgePlugin);

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
        edges: '',
        ranker: 'network-simplex',
      });
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

    // {connection, arrow, lineStyle, labelText, labelColor, fontSize}
    @attr
    set edges(val) {
      this.subject.clearLayout();
      if(typeof val === 'string' && val !== '') {
        const edges = val.split(',').map(v => v.trim());
        const rules = [];
        edges.forEach((edge) => {
          const edgeRule = {arrow: false, lineStyle: 'solid'};
          const jointExp = /^(\S+)(--|~~|->|~>)(\S+)?/;
          let matched = edge.match(jointExp);
          if(matched) {
            edgeRule.connection = [matched[1], matched[3]];
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
        this.set('edges', rules);
      } else {
        this.set('edges', val);
      }
    }
  }

  const _init = Symbol('init');

  class Dagre extends Group {
    static Attr = DagreAttr;

    constructor(...args) {
      super(...args);
      this[_init] = false;
    }

    render(t, context) {
      if(!this[_init]) {
        context.globalAlpha = 0;
      }
      return super.render(t, context);
    }
  }

  Dagre.applyLayout('dagre', {
    attrs: {

    },
    relayout(group, items) {
      group[_init] = true;
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

      items.forEach((item) => {
        if(item instanceof DagreEdge && item.autoUpdated_) {
          item.autoUpdated_ = false;
        }
      });

      const edges = group.attr('edges');
      if(edges) {
        edges.forEach((edge) => {
          let edgeNode = group.querySelector(`dagreedge[connection="${edge.connection}"]`);
          if(!edgeNode) {
            edgeNode = new DagreEdge();
            edgeNode.autoUpdated_ = true;
            group.append(edgeNode);
            items.push(edgeNode);
          }
          if(edgeNode.autoUpdated_ === false) {
            edgeNode.autoUpdated_ = true;
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
          if(labelText) {
            edgeNode.attr({label: labelText});
          }
          if(labelColor) {
            edgeNode.attr({labelColor});
          }
          if(lineStyle === 'dashed') {
            const lineWidth = edgeNode.attr('lineWidth');
            edgeNode.attr({lineDash: [2 * lineWidth, 3 * lineWidth]});
          }
          // console.log(`[${edge.connection}]`, edge);
        });
      }

      items.forEach((item, idx) => {
        const type = item.nodeType;
        if(type === 'dagreedge') {
          if(item.autoUpdated_ === false) {
            item.remove();
          } else {
            const connection = item.attr('connection');
            const label = item.attr('label');
            item.id = item.id || `edge${idx}_`;
            if(connection) {
              g.setEdge(...connection, {label, id: item.id});
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
      g.nodes().forEach((v) => {
        const node = group.getElementById(v);
        v = g.node(v);
        node.attr('layoutX', v.x);
        node.attr('layoutY', v.y);
      });

      g.edges().forEach((v) => {
        const {id, points} = g.edge(v);
        const edge = group.getElementById(id);
        edge.attr('points', points.map(({x, y}) => [x, y]));
      });
      group[_init] = true;
    },
  });

  registerNodeType('dagre', Dagre);

  return {Dagre};
}
