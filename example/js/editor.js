'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

spritejs.use(spriteDagre);

var _spritejs = spritejs,
    Scene = _spritejs.Scene,
    Dagre = _spritejs.Dagre,
    RoughCircle = _spritejs.RoughCircle;

var scene = new Scene('#container', {
  viewport: 'auto',
  resolution: 'flex'
});

var fglayer = scene.layer('fglayer');

var dagreGroup = new Dagre({
  anchor: 0.5,
  pos: fglayer.center,
  lineWidth: 5,
  align: 'DR',
  // labelBg: 'blue',
  // bgcolor: 'grey',
  // border: [1, 'red'],
  transition: 0.3
});
fglayer.append(dagreGroup);

dagreGroup.on('appendChild', function (_ref) {
  var child = _ref.child;

  child.on('mouseenter', function (evt) {
    child.attr({ strokeColor: 'green' });
  });
  child.on('mouseleave', function (evt) {
    child.attr({ strokeColor: 'inherit' });
  });
  child.on('click', function (evt) {
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

dagreGroup.updateGraph('\ngraph TB\n  ; \u6CE8\u91CA\n  start:!start\n  update:[\u66F4\u65B0\u8BBE\u7F6E]\n  decision:<\u662F\u5426\u7F13\u5B58\uFF1F>\n  fresh:/\u66F4\u65B0\u7F13\u5B58/\n  finished:(\u7ED3\u675F)\n  start->update \u5F00\u59CB red\n  update~~decision\n  decision~>fresh \u662F\n  decision->finished \u5426\n  fresh->finished\n', {
  start: function start() {
    return new RoughCircle({
      id: 'start',
      radius: 20
    });
  }
});

/*
  id:!start
  id:[rectangle]
  id:[(rounded)]
  id:(ellispe)
  id:<rhombus>
  id:/parallel/
 */
// dagreGroup.addNodes(`
//   start:!start
//   update:[更新设置]
//   decision:<是否缓存？>
//   fresh:/更新缓存/
//   finished:(结束)
// `, {
//   start() {
//     return new RoughCircle({
//       id: 'start',
//       radius: 20,
//     });
//   },
// });

// dagreGroup.addEdges(`
//   start->update 开始 red
//   update~~decision
//   decision~>fresh 是
//   decision->finished 否
//   fresh->finished
// `);