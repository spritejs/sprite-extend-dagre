'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

spritejs.use(spriteDagre);

var _spritejs = spritejs,
    Scene = _spritejs.Scene,
    Dagre = _spritejs.Dagre,
    RoughCircle = _spritejs.RoughCircle,
    Group = _spritejs.Group,
    Label = _spritejs.Label,
    DagreRectangle = _spritejs.DagreRectangle,
    DagreRoundedrect = _spritejs.DagreRoundedrect,
    DagreEllispe = _spritejs.DagreEllispe,
    DagreRhombus = _spritejs.DagreRhombus,
    DagreParallel = _spritejs.DagreParallel;


var scene = new Scene('#container', {
  viewport: 'auto',
  resolution: 'flex',
  useDocumentCSS: true
});

var fglayer = scene.layer('fglayer');

var trash = new Label('🗑');
trash.attr({
  anchor: 0.5,
  fontSize: 150,
  x: '90%',
  y: 180
});
fglayer.append(trash);

trash.on('mouseenter', function (evt) {
  trash.attr('scale', 1.2);
});

trash.on('mouseleave', function (evt) {
  trash.attr('scale', 1.0);
});

var controlGroup = new Group({
  width: 400,
  height: '100%',
  bgcolor: '#eee',
  zIndex: 1000,
  font: '32px "Hannotate SC"',
  lineWidth: 5
});
fglayer.append(controlGroup);

controlGroup.on('click', function (evt) {
  evt.stopDispatch();
});

var text = new Label('拖拽添加节点');
text.attr({
  anchor: 0.5,
  pos: [200, 50]
});
controlGroup.append(text);

var targetNode = void 0;

var step = new DagreRectangle({
  anchor: 0.5,
  pos: [200, 200],
  label: '执行步骤'
});
controlGroup.append(step);

var desicion = new DagreRhombus({
  anchor: 0.5,
  pos: [200, 400],
  label: '判断分支'
});
controlGroup.append(desicion);

var operation = new DagreParallel({
  anchor: 0.5,
  pos: [200, 600],
  label: '输入输出'
});
controlGroup.append(operation);

var state = new DagreRoundedrect({
  anchor: 0.5,
  pos: [200, 800],
  label: '系统状态'
});
controlGroup.append(state);

var state2 = new DagreEllispe({
  anchor: 0.5,
  pos: [200, 1000],
  label: '内部状态'
});
controlGroup.append(state2);

var dagreGroup = new Dagre({
  anchor: 0.5,
  pos: fglayer.center,
  translate: [200, 0],
  lineWidth: 5,
  transition: 0.3
});
fglayer.append(dagreGroup);

controlGroup.children.forEach(function (s) {
  s.on('mousedown', function (evt) {
    var node = evt.target;
    node.on('mousemove', function (evt) {
      node.off('mousemove');
      var c = node.cloneNode();
      c.attr({
        pos: [evt.layerX, evt.layerY],
        lineWidth: 5,
        strokeColor: 'black',
        opacity: 0.3,
        zIndex: 9999,
        id: Math.random().toString(36).slice(2)
      });
      fglayer.append(c);
      c.setMouseCapture();
      c.on('mousemove', function (evt) {
        c.attr({
          pos: [evt.layerX, evt.layerY]
        });
      });
      c.on('mouseup', function (evt) {
        c.releaseMouseCapture();
        if (targetNode && targetNode.nodeType !== 'dagreedge') {
          c.attr('opacity', 1.0);
          c.off('mouseup');
          dagreGroup.appendChild(c);
          dagreGroup.addEdges(targetNode.id + '->' + c.id);
        } else {
          c.remove();
        }
      });
    });
  });
});

function removeNode(targetNode) {
  if (targetNode.id === 'start') {
    dagreGroup.updateGraph('start:((S))');
  } else {
    if (targetNode.nodeType !== 'dagreedge') {
      var edges = dagreGroup.graph.nodeEdges(targetNode.id);
      edges.forEach(function (edge) {
        var edgeNode = dagreGroup.getEdge(edge.v, edge.w);
        if (edgeNode) edgeNode.remove();
      });
    }
    targetNode.remove();
  }
}

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 8 && targetNode) {
    removeNode(targetNode);
  }
});

dagreGroup.on('appendChild', function (_ref) {
  var child = _ref.child;

  child.on('mousedown', function (evt) {
    if (child.nodeType === 'dagreedge') return;
    child.on('mousemove', function (evt) {
      child.off('mousemove');
      var c = child.cloneNode();
      c.attr({
        pos: [evt.layerX, evt.layerY],
        lineWidth: 5,
        strokeColor: 'black',
        opacity: 0.3
      });
      fglayer.append(c);
      c.setMouseCapture();
      c.on('mousemove', function (evt) {
        c.attr({
          pos: [evt.layerX, evt.layerY]
        });
      });
      c.on('mouseup', function (evt) {
        if (targetNode && child !== targetNode && targetNode.nodeType !== 'dagreedge') {
          if (!dagreGroup.getEdge(targetNode.id, child.id)) {
            dagreGroup.addEdges(targetNode.id + '->' + child.id);
          }
        }
        if (trash.attr('scale')[0] === 1.2) {
          removeNode(child);
        }
        c.releaseMouseCapture();
        c.remove();
      });
    });
  });
  child.on('mouseup', function (evt) {
    if (child.nodeType !== 'dagreedge') {
      child.releaseMouseCapture();
      child.off('mousemove');
    }
  });
  child.on('click', function (evt) {
    if (child.nodeType === 'dagreedge') {
      var arrowSize = child.attr('arrowSize');
      if (arrowSize) {
        child.attr('arrowSize', 0);
      } else {
        child.attr('arrowSize', 24);
        var lineDash = child.attr('lineDash');
        if (!lineDash.length) {
          var lineWidth = child.attr('lineWidth');
          child.attr({ lineDash: [Math.max(5, 2 * lineWidth), Math.max(10, 3 * lineWidth)] });
        } else {
          child.attr({ lineDash: [] });
        }
      }
    }
  });
  child.on('mouseenter', function (evt) {
    targetNode = child;
    child.attr({ strokeColor: 'orange' });
  });
  child.on('mouseleave', function (evt) {
    targetNode = null;
    child.attr({ strokeColor: null });
  });
  child.on('dblclick', function (evt) {
    var label = child.attr('label');

    var _child$attr = child.attr('labelXY'),
        _child$attr2 = _slicedToArray(_child$attr, 2),
        x = _child$attr2[0],
        y = _child$attr2[1];

    if (label) {
      if (x !== '' && y !== '') {
        var _dagreGroup$renderRec = _slicedToArray(dagreGroup.renderRect, 2),
            x0 = _dagreGroup$renderRec[0],
            y0 = _dagreGroup$renderRec[1];

        var _ref2 = [(x0 + x) / 2, (y0 + y) / 2];
        x = _ref2[0];
        y = _ref2[1];
      } else {
        var _dagreGroup$renderRec2 = _slicedToArray(dagreGroup.renderRect, 2),
            _x = _dagreGroup$renderRec2[0],
            _y = _dagreGroup$renderRec2[1];

        var _child$renderRect = _slicedToArray(child.renderRect, 4),
            x1 = _child$renderRect[0],
            y1 = _child$renderRect[1],
            _w = _child$renderRect[2],
            _h = _child$renderRect[3];

        x = (_x + x1 + _w / 2) / 2;
        y = (_y + y1 + _h / 2) / 2;
      }

      var _child$labelSize = _slicedToArray(child.labelSize, 2),
          w = _child$labelSize[0],
          h = _child$labelSize[1];

      var textInput = document.createElement('input');
      textInput.style.position = 'absolute';
      textInput.style.left = x - w / 4 + 'px';
      textInput.style.top = y - h / 4 + 'px';
      textInput.value = label;
      document.body.appendChild(textInput);
      textInput.focus();
      textInput.select();
      textInput.addEventListener('blur', function () {
        child.label = textInput.value;
        textInput.remove();
      });
      textInput.addEventListener('keydown', function (evt) {
        if (evt.keyCode === 13) {
          textInput.blur();
        }
      });
    }
    // console.log(label, x, y, evt.originalEvent);
  });
});

scene.on('resolutionChange', _.debounce(function (evt) {
  dagreGroup.attr({ pos: fglayer.center });
}, 300));

scene.delegateEvent('mousewheel');

var groupScale = 1.0;
fglayer.on('mousewheel', function (evt) {
  var delta = evt.originalEvent.wheelDelta / 12000;
  groupScale += delta;
  groupScale = Math.min(groupScale, 2.0);
  groupScale = Math.max(groupScale, 0.2);

  dagreGroup.attr({ scale: groupScale });
});

/*
  id:!start
  id:[rectangle]
  id:[(rounded)]
  id:(ellispe)
  id:<rhombus>
  id:/parallel/
 */
dagreGroup.updateGraph('\ngraph UR\n  ; \u6CE8\u91CA\n  ; start:!start\n  start:((S))\n  update:[\u66F4\u65B0\u8BBE\u7F6E]\n  decision:<\u662F\u5426\u7F13\u5B58\uFF1F>\n  fresh:/\u66F4\u65B0\u7F13\u5B58/\n  finished:(\u7ED3\u675F)\n  ; ((A))\n  start->update{\u5F00\u59CB red}\n  update~~decision\n  decision~>fresh{\u662F}\n  decision->finished{\u5426}\n  fresh->finished\n  ; A->C{"Y->" rgba(0,255,0,1) 22px}->fresh\n', {
  start: function start() {
    return new RoughCircle({
      id: 'start',
      radius: 20
    });
  }
});