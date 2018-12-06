spritejs.use(spriteDagre);

const {Scene, Dagre, RoughCircle} = spritejs;
const scene = new Scene('#container', {
  viewport: 'auto',
  resolution: 'flex',
});

const fglayer = scene.layer('fglayer');

const dagreGroup = new Dagre({
  anchor: 0.5,
  pos: fglayer.center,
  lineWidth: 5,
  align: 'DR',
  // labelBg: 'blue',
  // bgcolor: 'grey',
  // border: [1, 'red'],
  transition: 0.3,
});
fglayer.append(dagreGroup);

dagreGroup.on('appendChild', ({child}) => {
  child.on('mouseenter', (evt) => {
    child.attr({strokeColor: 'green'});
  });
  child.on('mouseleave', (evt) => {
    child.attr({strokeColor: 'inherit'});
  });
  child.on('click', (evt) => {
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

/*
  id:!start
  id:[rectangle]
  id:[(rounded)]
  id:(ellispe)
  id:<rhombus>
  id:/parallel/
 */
dagreGroup.setNodes(`
  start:!start,
  update:[更新设置],
  decision:<是否缓存？>,
  fresh:/更新缓存/,
  finished:[(结束)],
`, {
  start() {
    return new RoughCircle({
      id: 'start',
      radius: 20,
    });
  },
});

dagreGroup.setEdges(`
  start->update 开始 red,
  update~~decision,
  decision~>fresh 是,
  decision->finished 否,
  fresh->finished,
`);
