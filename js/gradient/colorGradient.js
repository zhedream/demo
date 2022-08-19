export default class ColorGradient {
  constructor(colors, step = 20) {
    this.allColorList = [];
    this.setColor(colors, step);
  }

  setColor(colors, step = 20) {
    this.allColorList = [];
    for (let i = 1; i < colors.length; i++) {
      let left = colors[i - 1];
      let right = colors[i];

      const colorArr = this.generateGradientColors(left, right, step);
      this.allColorList = this.allColorList.concat(colorArr);
    }
  }

  /**
   * 获取 val 在 min-max 之间的颜色
   * @param min {number} - 最小值
   * @param max {number} - 最大值
   * @param val {number} - 当前值
   * @returns {[number,number,number]} - [r,g,b]
   */
  getValColor(min, max, val) {
    // console.log('this.allColorList: ', this.allColorList);
    const stepCount = this.allColorList.length; // n个色阶, n种过度颜色

    if (val <= min) {
      return this.allColorList[0];
    } else if (val >= max) {
      return this.allColorList[this.allColorList.length - 1];
    }
    let percent = (val - min) / (max - min); //

    return this.allColorList[parseInt(percent * stepCount + "", 10)];
  }

  getLogValColor(val, maxValue) {
    let min = 0;
    let max = 100;
    const stepCount = this.allColorList.length; // n个色阶, n种过度颜色

    val = this._logScale(val, maxValue);

    if (val < min) {
      return this.allColorList[0];
    } else if (val >= max) {
      return this.allColorList[this.allColorList.length - 1];
    }
    let percent = (val - min) / (max - min); //

    let color = this.allColorList[parseInt(percent * stepCount + "", 10)];
    return color;
  }

  _logScale(val, maxValue, multiple = 100) {
    if (val <= 1) return 0; // log is undefined for 0, log(1) = 0
    return (multiple * Math.log(val)) / Math.log(maxValue);
  }

  /**
   * hex 颜色 取反色
   * @param oldColor
   * @returns {string}
   */
  colorReverse(oldColor){
     oldColor = '0x' + oldColor.replace(/#/g, '');
    const str = '000000' + (0xFFFFFF - oldColor).toString(16);
    return str.substring(str.length - 6, str.length);
  }

  getColorList() {
    return this.allColorList;
  }

  /**
   * 颜色渐变集合
   * @param {string} startColor 开始颜色, HEX OR RGB
   * @param {string} endColor 结束颜色
   * @param {number} step 色阶, 越大颜色过度越平滑
   * @return {[number,number,number][]} 颜色集合 [[r,g,b]]
   */
  generateGradientColors(startColor, endColor, step) {
    const startRGB = this.toRGBArray(startColor);
    const endRGB = this.toRGBArray(endColor);
    const stepR = (endRGB[0] - startRGB[0]) / step;
    const stepG = (endRGB[1] - startRGB[1]) / step;
    const stepB = (endRGB[2] - startRGB[2]) / step;
    const colors = [];
    for (let i = 0; i < step; i++) {
      colors.push([
        parseInt(startRGB[0] + stepR * i + "", 10),
        parseInt(startRGB[1] + stepG * i + "", 10),
        parseInt(startRGB[2] + stepB * i + "", 10),
      ]);
    }
    return colors;
  }

  // 正则判断 rgb
  isRGB(color) {
    let rgb =
      /^rgb|RGB\((([0-9]|[1-9]\d|1\d\d|2([0-4]\d|5[0-5])),){2}([0-9]|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\)$/;
    return rgb.test(color);
  }

// 判断 是否是hex
  isHex(color) {
    let hex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
    return hex.test(color);
  }

  /**
   * 解析rgb格式
   * @param {string} color RGB OR Hex
   * @return {[number,number,number]} 颜色集合 [r,g,b]
   */
  toRGBArray(color) {

    if (this.isRGB(color)) {
      return this.getRGBNumber(color);
    }

    color = color.toLowerCase().substring(1, color.length);
    let colors = [];
    colors.push(parseInt(color.substring(0, 2), 16));
    colors.push(parseInt(color.substring(2, 4), 16));
    colors.push(parseInt(color.substring(4, 6), 16));
    return colors;
  }

  /**
   * 将rgb转换为数字
   * @param rgb {string} - 颜色 rgb(r,g,b)
   * @returns {[number,number,number]} - [r,g,b]
   * @description rgb(11,22,33) => [11,22,33]
   */
  getRGBNumber(rgb) {
    // 匹配括号内的数字
    let reg = /\d+/g;
    return rgb.match(reg);
  }

  /**
   * rgb转hex
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @return {string} 十六进制颜色,如 #2860fd
   */
  toHex(r, g, b) {
    var hex =
      "#" +
      this.addZero(r.toString(16)) +
      this.addZero(g.toString(16)) +
      this.addZero(b.toString(16));
    return hex;
  }

  /**
   *   加0补位
   */
  addZero(v) {
    var newv = "00" + v;
    return newv.substring(newv.length - 2, newv.length);
  }
}

// let colors = [
//   '#00ff00',
//   '#c0ff3e',
//   '#ffff00',
//   '#ff8000',
//   '#ff0000',
//   '#9933fa',
//   '#551a8b'
// ]

// ColorGradient.prototype.generateGradientColors

// const c = new ColorGradient(colors, 20);

// let color = c.getValColor(100, 200, 250);
// console.log('color: ', color);

// color = c.toHex.apply(c, color)
// console.log('color: ', color);
