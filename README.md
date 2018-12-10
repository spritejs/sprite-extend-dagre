# Sprite-Dagre

SpriteJS Renderer for [Dagre](https://github.com/dagrejs/dagre).

Inspired by [MermaidJS](https://mermaidjs.github.io).

## Usage

```html
<script src="https://unpkg.com/spritejs/dist/spritejs.min.js"></script>
<script src="https://unpkg.com/sprite-extend-rough/dist/sprite-extend-rough.js"></script>
<script src="https://unpkg.com/sprite-extend-dagre/dist/sprite-extend-dagre.js"></script>
<script>
const {Scene, Dagre} = spritejs;

const scene = new Scene('#container', {
  viewport: 'auto',
  resolution: 'flex',
  useDocumentCSS: true,
});

const fglayer = scene.layer('fglayer');  
const dagreGroup = new Dagre({
  anchor: 0.5,
  pos: fglayer.center,
});
fglayer.append(dagreGroup);

dagreGroup.layoutGraph(`
  graph TB
    A->B--C~>D
`);
</script>
```

## Dagre

## Flow charts

**Graph** declares a new graph and the direction of the graph layout.
