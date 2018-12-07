spritejs.use(spriteDagre);

const {Scene, Dagre, RoughCircle, Group, Label,
  DagreRectangle, DagreRoundedrect, DagreEllispe, DagreRhombus, DagreParallel} = spritejs;

const scene = new Scene('#container', {
  viewport: 'auto',
  resolution: 'flex',
  useDocumentCSS: true,
});

const fglayer = scene.layer('fglayer');

const trash = new Label('🗑');
trash.attr({
  anchor: 0.5,
  fontSize: 150,
  x: '90%',
  y: 180,
});
fglayer.append(trash);

trash.on('mouseenter', (evt) => {
  trash.attr('scale', 1.2);
});

trash.on('mouseleave', (evt) => {
  trash.attr('scale', 1.0);
});

const controlGroup = new Group({
  width: 400,
  height: '100%',
  bgcolor: '#eee',
  zIndex: 1000,
  font: '32px "Hannotate SC"',
  lineWidth: 5,
});
fglayer.append(controlGroup);

controlGroup.on('click', (evt) => {
  evt.stopDispatch();
});

const text = new Label('拖拽添加节点');
text.attr({
  anchor: 0.5,
  pos: [200, 50],
});
controlGroup.append(text);

let targetNode;

const step = new DagreRectangle({
  anchor: 0.5,
  pos: [200, 200],
  label: '执行步骤',
});
controlGroup.append(step);

const desicion = new DagreRhombus({
  anchor: 0.5,
  pos: [200, 400],
  label: '判断分支',
});
controlGroup.append(desicion);

const operation = new DagreParallel({
  anchor: 0.5,
  pos: [200, 600],
  label: '输入输出',
});
controlGroup.append(operation);

const state = new DagreRoundedrect({
  anchor: 0.5,
  pos: [200, 800],
  label: '系统状态',
});
controlGroup.append(state);

const state2 = new DagreEllispe({
  anchor: 0.5,
  pos: [200, 1000],
  label: '内部状态',
});
controlGroup.append(state2);

const dagreGroup = new Dagre({
  anchor: 0.5,
  pos: fglayer.center,
  translate: [200, 0],
  lineWidth: 5,
  transition: 0.3,
});
fglayer.append(dagreGroup);

controlGroup.children.forEach((s) => {
  s.on('mousedown', (evt) => {
    const node = evt.target;
    node.on('mousemove', (evt) => {
      node.off('mousemove');
      const c = node.cloneNode();
      c.attr({
        pos: [evt.layerX, evt.layerY],
        lineWidth: 5,
        strokeColor: 'black',
        opacity: 0.3,
        zIndex: 9999,
        id: Math.random().toString(36).slice(2),
      });
      fglayer.append(c);
      c.setMouseCapture();
      c.on('mousemove', (evt) => {
        c.attr({
          pos: [evt.layerX, evt.layerY],
        });
      });
      c.on('mouseup', (evt) => {
        c.releaseMouseCapture();
        if(targetNode && targetNode.nodeType !== 'dagreedge') {
          c.attr('opacity', 1.0);
          c.off('mouseup');
          dagreGroup.appendChild(c);
          dagreGroup.addEdges(`${targetNode.id}->${c.id}`);
        } else {
          c.remove();
        }
      });
    });
  });
});

function removeNode(targetNode) {
  if(targetNode.id === 'start') {
    dagreGroup.updateGraph('start:((S))');
  } else {
    if(targetNode.nodeType !== 'dagreedge') {
      const edges = dagreGroup.graph.nodeEdges(targetNode.id);
      edges.forEach((edge) => {
        const edgeNode = dagreGroup.getEdge(edge.v, edge.w);
        if(edgeNode) edgeNode.remove();
      });
    }
    targetNode.remove();
  }
}

document.addEventListener('keydown', (evt) => {
  if(evt.keyCode === 8 && targetNode) {
    removeNode(targetNode);
  }
});

dagreGroup.on('appendChild', ({child}) => {
  child.on('mousedown', (evt) => {
    if(child.nodeType === 'dagreedge') return;
    child.on('mousemove', (evt) => {
      child.off('mousemove');
      const c = child.cloneNode();
      c.attr({
        pos: [evt.layerX, evt.layerY],
        lineWidth: 5,
        strokeColor: 'black',
        opacity: 0.3,
      });
      fglayer.append(c);
      c.setMouseCapture();
      c.on('mousemove', (evt) => {
        c.attr({
          pos: [evt.layerX, evt.layerY],
        });
      });
      c.on('mouseup', (evt) => {
        if(targetNode && child !== targetNode && targetNode.nodeType !== 'dagreedge') {
          if(!dagreGroup.getEdge(targetNode.id, child.id)) {
            dagreGroup.addEdges(`${targetNode.id}->${child.id}`);
          }
        }
        if(trash.attr('scale')[0] === 1.2) {
          removeNode(child);
        }
        c.releaseMouseCapture();
        c.remove();
      });
    });
  });
  child.on('mouseup', (evt) => {
    if(child.nodeType !== 'dagreedge') {
      child.releaseMouseCapture();
      child.off('mousemove');
    }
  });
  child.on('click', (evt) => {
    if(child.nodeType === 'dagreedge') {
      const arrowSize = child.attr('arrowSize');
      if(arrowSize) {
        child.attr('arrowSize', 0);
      } else {
        child.attr('arrowSize', 24);
        const lineDash = child.attr('lineDash');
        if(!lineDash.length) {
          const lineWidth = child.attr('lineWidth');
          child.attr({lineDash: [Math.max(5, 2 * lineWidth), Math.max(10, 3 * lineWidth)]});
        } else {
          child.attr({lineDash: []});
        }
      }
    }
  });
  child.on('mouseenter', (evt) => {
    targetNode = child;
    child.attr({strokeColor: 'orange'});
  });
  child.on('mouseleave', (evt) => {
    targetNode = null;
    child.attr({strokeColor: null});
  });
  child.on('dblclick', (evt) => {
    const label = child.attr('label');
    let [x, y] = child.attr('labelXY');
    if(label) {
      if(x !== '' && y !== '') {
        const [x0, y0] = dagreGroup.renderRect;
        [x, y] = [(x0 + x) / 2, (y0 + y) / 2];
      } else {
        const [x0, y0] = dagreGroup.renderRect;
        const [x1, y1, w, h] = child.renderRect;
        [x, y] = [(x0 + x1 + w / 2) / 2, (y0 + y1 + h / 2) / 2];
      }
      const [w, h] = child.labelSize;
      const textInput = document.createElement('input');
      textInput.style.position = 'absolute';
      textInput.style.left = `${x - w / 4}px`;
      textInput.style.top = `${y - h / 4}px`;
      textInput.value = label;
      document.body.appendChild(textInput);
      textInput.focus();
      textInput.select();
      textInput.addEventListener('blur', () => {
        child.label = textInput.value;
        textInput.remove();
      });
      textInput.addEventListener('keydown', (evt) => {
        if(evt.keyCode === 13) {
          textInput.blur();
        }
      });
    }
    // console.log(label, x, y, evt.originalEvent);
  });
});

scene.on('resolutionChange', _.debounce((evt) => {
  dagreGroup.attr({pos: fglayer.center});
}, 300));

scene.delegateEvent('mousewheel');

let groupScale = 1.0;
fglayer.on('mousewheel', (evt) => {
  const delta = evt.originalEvent.wheelDelta / 12000;
  groupScale += delta;
  groupScale = Math.min(groupScale, 2.0);
  groupScale = Math.max(groupScale, 0.2);

  dagreGroup.attr({scale: groupScale});
});

/*
  id:!start
  id:[rectangle]
  id:[(rounded)]
  id:(ellispe)
  id:<rhombus>
  id:/parallel/
 */
dagreGroup.updateGraph(`
graph UR
  ; 注释
  ; start:!start
  start:((S))
  update:[更新设置]
  decision:<是否缓存？>
  fresh:/更新缓存/
  finished:(结束)
  ; ((A))
  start->update{开始 red}
  update~~decision
  decision~>fresh{是}
  decision->finished{否}
  fresh->finished
  ; A->C{"Y->" rgba(0,255,0,1) 22px}->fresh
`, {
  start() {
    return new RoughCircle({
      id: 'start',
      radius: 20,
    });
  },
});
