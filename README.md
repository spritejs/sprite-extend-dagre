# Sprite-Dagre

Draws simple flow chart diagrams with spritejs. Powered by [Dagre](https://github.com/dagrejs/dagre). Inspired by [MermaidJS](https://mermaidjs.github.io).

## Usage

[CodePen](https://codepen.io/akira-cn/pen/ebYjYX)

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
  pos: fglayer.center,
  anchor: 0.5,
  lineWidth: 5,
});
fglayer.append(dagreGroup);

dagreGroup.layoutGraph(`
  graph TB
    A->B~~D
    B~>C
`);
</script>
```

<img src="https://p1.ssl.qhimg.com/t0121a97aee1b4b8929.jpg" width="400px">

## Flow charts

**Graph [direction]** declares a new graph and the direction of the graph layout.

Possible directions are:

- TB - top bottom (default)
- BT - bottom top
- RL - right left
- LR - left right

```js
dagreGroup.layoutGraph(`
  graph LR
    A->B--C~>D
`);
```

This declares a graph oriented from left to right.

<img src="https://p3.ssl.qhimg.com/t01536d749b34f81c4e.jpg" width="400px">

### Nodes & Shapes

#### A node (default)

```js
dagreGroup.layoutGraph(`
  graph LR
    id
`);
```

<img src="https://p2.ssl.qhimg.com/t0146e72f3598e94457.jpg" width="400px">

#### A node with text

```js
dagreGroup.layoutGraph(`
  graph LR
    id1[This is the text in the box]
`);
```

<img src="https://p3.ssl.qhimg.com/t01efd985c1b5182cde.jpg" width="400px">

#### A node with round edges

```js
dagreGroup.layoutGraph(`
  graph LR
    id1(This is the text in the box)
`);
```

<img src="https://p1.ssl.qhimg.com/t01f6d90cab869c2bfd.jpg" width="400px">

#### A node in the form of an ellipse

```js
dagreGroup.layoutGraph(`
  graph LR
    id1((This is the text in the ellipse))
`);
```

<img src="https://p4.ssl.qhimg.com/t010d7369c05d30786b.jpg" width="400px">

#### A node (rhombus)

```js
dagreGroup.layoutGraph(`
  graph LR
    id1<This is the text in the box>
`);
```

<img src="https://p2.ssl.qhimg.com/t01a42a4bdf1e02a702.jpg" width="400px">

#### A node (parallelogram)

```js
dagreGroup.layoutGraph(`
  graph LR
    id1/This is the text in the box/
`);
```

<img src="https://p1.ssl.qhimg.com/t018f6d7992b4657e0e.jpg" width="400px">

#### A user defined node

```js
dagreGroup.layoutGraph(`
  graph LR
    id1!star
`, {
  star() {
    const star = new Star();
    star.attr({
      radius: 100,
      color: 'red',
      angles: 5,
      fillColor: 'red',
    });
    return star;
  },
});
```

<img src="https://p0.ssl.qhimg.com/t01db81939c05dc0a18.jpg" width="400px">

### Links between nodes

#### A link with arrow head

```js
dagreGroup.layoutGraph(`
  graph LR
    A->B
`);
```

<img src="https://p5.ssl.qhimg.com/t01c4bf673fec262557.jpg" width="400px">

#### An open link

```js
dagreGroup.layoutGraph(`
  graph LR
    A--B
`);
```

<img src="https://p3.ssl.qhimg.com/t01426f4dc668465bfc.jpg" width="400px">

#### A dashed link

```js
dagreGroup.layoutGraph(`
  graph LR
    A~>B
`);
```

<img src="https://p0.ssl.qhimg.com/t010c7071d05403af62.jpg" width="400px">

#### A dashed open link

```js
dagreGroup.layoutGraph(`
  graph LR
    A~~B
`);
```

<img src="https://p1.ssl.qhimg.com/t01f3c9315b1b418cfc.jpg" width="400px">

#### A link with text

```js
dagreGroup.layoutGraph(`
  graph LR
    A->B{"Link text"}
`);
```

<img src="https://p2.ssl.qhimg.com/t019761e7d42ea76eaf.jpg" width="400px">

#### A link with colored text

```js
dagreGroup.layoutGraph(`
  graph LR
    A->B{"Link text" red}
`);
```

<img src="https://p0.ssl.qhimg.com/t01f621d310cd55048c.jpg" width="400px">

### Demo

[CodePen](https://codepen.io/akira-cn/pen/QzWZdv)

```js
const {Scene, Dagre} = spritejs;

const scene = new Scene('#container', {
  viewport: 'auto',
  resolution: 'flex',
  useDocumentCSS: true,
});

const fglayer = scene.layer('fglayer');  
const dagreGroup = new Dagre({
  pos: fglayer.center,
  lineWidth: 5,
  anchor: 0.5,
});
fglayer.append(dagreGroup);

dagreGroup.layoutGraph(`
  graph TB
    start((S))
    step1[proceed]
    step2<decision?>
    step3/read file/
    step4(done)
    start->step1->step2
    step2~>step4{no}
    step2->step3{yes}
    step3->step4
`);
```

<img src="https://p3.ssl.qhimg.com/t01b0894a9cfbb7cdd8.jpg" width="400px">

### Styling nodes & links

[CodePen](https://codepen.io/akira-cn/pen/madzMJ)

```css
#step1 {
  --sprite-fillColor: red;
  --sprite-labelBg: white;
}

#step2 {
  --sprite-strokeColor: blue;
  --sprite-labelColor: red;
}

dagreedge[connection="[step1,step2]"] {
  --sprite-strokeColor: green;
}
```

```js
const {Scene, Dagre} = spritejs;

const scene = new Scene('#container', {
  viewport: 'auto',
  resolution: 'flex',
  useDocumentCSS: true,
});

const fglayer = scene.layer('fglayer');  
const dagreGroup = new Dagre({
  pos: fglayer.center,
  lineWidth: 5,
  anchor: 0.5,
});
fglayer.append(dagreGroup);

dagreGroup.layoutGraph(`
  graph TB
    start((S))
    step1[proceed]
    step2<decision?>
    step3/read file/
    step4(done)
    start->step1->step2
    step2~>step4{no}
    step2->step3{yes}
    step3->step4
`);
```

<img src="https://p5.ssl.qhimg.com/t01846d1238f44ea7e7.jpg" width="400px">
