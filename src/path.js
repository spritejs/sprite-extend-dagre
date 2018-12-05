export default function install({__spritejs, use, utils, registerNodeType, Path}) {
  const {attr, parseValue, parseStringFloat, inherit, parseColorString, parseFont} = utils;

  let defaultFont = 'normal normal normal 32px Arial';
  if(__spritejs.Rough) defaultFont = 'normal normal normal 32px "Hannotate SC"';

  class DagrePathAttr extends Path.Attr {
    constructor(subject) {
      super(subject);
      this.setDefault({
        bounding: 'path',
        label: '',
        labelX: '',
        labelY: '',
        font: 'inherit',
        labelColor: 'inherit',
        labelBg: 'inherit',
        clipOverflow: false,
        // lineJoin: 'round',
        // lineCap: 'round',
      });
    }

    @parseValue(parseColorString)
    @attr
    @inherit('')
    set labelBg(val) {
      this.set('labelBg', val);
    }

    @parseValue(parseColorString)
    @attr
    @inherit('rgba(0,0,0,1)')
    set labelColor(val) {
      this.set('labelColor', val);
    }

    @attr
    @inherit(defaultFont)
    set font(val) {
      this.set('font', val);
    }

    @attr
    set fontSize(val) {
      if(val == null) val = '16px';
      let unit = 'px';
      if(typeof val === 'string') {
        const unitReg = /^([\d.]+)(\w+)/;
        const matches = val.match(unitReg);
        if(!matches) {
          return null;
        }
        val = parseFloat(matches[1]);
        unit = matches[2];
      }
      const font = this.font;
      const {style, variant, weight, family} = parseFont(font);
      const fontValue = `${style} ${variant} ${weight} ${val}${unit} ${family}`;
      this.font = fontValue;
    }

    get fontSize() {
      const font = this.font;
      const {size0, unit} = parseFont(font);
      return `${size0}${unit}`;
    }

    @attr
    set fontFamily(val) {
      if(val == null) val = 'Arial';
      const font = this.font;
      const {style, variant, weight, size0, unit} = parseFont(font);
      const fontValue = `${style} ${variant} ${weight} ${size0}${unit} ${val}`;
      this.font = fontValue;
    }

    get fontFamily() {
      return parseFont(this.font).family;
    }

    @attr
    set fontStyle(val) {
      if(val == null) val = 'normal';
      const font = this.font;
      const {variant, weight, size0, unit, family} = parseFont(font);
      const fontValue = `${val} ${variant} ${weight} ${size0}${unit} ${family}`;
      this.font = fontValue;
    }

    get fontStyle() {
      return parseFont(this.font).style;
    }

    @attr
    set fontVariant(val) {
      if(val == null) val = 'normal';
      const font = this.font;
      const {style, weight, size0, unit, family} = parseFont(font);
      const fontValue = `${style} ${val} ${weight} ${size0}${unit} ${family}`;
      this.font = fontValue;
    }

    get fontVariant() {
      return parseFont(this.font).variant;
    }

    @attr
    set fontWeight(val) {
      if(val == null) val = 'normal';
      const font = this.font;
      const {style, variant, size0, unit, family} = parseFont(font);
      const fontValue = `${style} ${variant} ${val} ${size0}${unit} ${family}`;
      this.font = fontValue;
    }

    get fontWeight() {
      return parseFont(this.font).weight;
    }

    @parseValue(parseFloat)
    @attr
    set labelX(val) {
      this.set('labelX', val);
    }

    @parseValue(parseFloat)
    @attr
    set labelY(val) {
      this.set('labelY', val);
    }

    @parseValue(parseStringFloat)
    @attr
    set labelXY(val) {
      if(val == null) {
        val = ['', ''];
      }
      const [x, y] = val;
      this.labelX = x;
      this.labelY = y;
    }

    get labelXY() {
      return [this.labelX, this.labelY];
    }
  }

  class DagrePath extends Path {
    static Attr = DagrePathAttr;

    renderLabel(label, context) {
      const rect = this.originalRect;
      let [cx, cy] = this.attr('labelXY');
      const font = this.attr('font');
      context.font = font;
      context.textBaseline = 'middle';
      const {width} = context.measureText(label);
      const padding = this.attr('padding');
      if(cx === '') cx = rect[2] / 2 - padding[0];
      if(cy === '') cy = rect[3] / 2 - padding[3];
      const labelBg = this.attr('labelBg');
      if(labelBg) {
        const {size} = parseFont(font);
        const rect = [cx - width / 2 - 6, cy - size / 2 - 6, width + 12, size + 12];
        context.fillStyle = labelBg;
        context.beginPath();
        context.rect(...rect);
        context.fill();
      }
      context.fillStyle = this.attr('labelColor');
      context.fillText(label, cx - width / 2, cy);
    }

    render(t, context) {
      const ret = super.render(t, context);
      const lineWidth = this.attr('lineWidth');
      const strokeColor = this.attr('strokeColor');
      context.lineWidth = lineWidth;
      context.strokeStyle = strokeColor;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      return ret;
    }
  }

  return {DagrePath};
}