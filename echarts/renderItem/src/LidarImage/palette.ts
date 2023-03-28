import { createCanvas } from "./canvas.util";

export class Palette {
  private readonly steps: number;
  private readonly palette: Uint8ClampedArray;

  constructor(colors, steps = 256) {
    this.steps = steps;
    let canvas = createCanvas(1, steps);
    let ctx = canvas.getContext("2d");
    let grad = ctx.createLinearGradient(0, 0, 1, steps);

    for (let i = 0; i < colors.length; i++) {
      const color = colors[i];
      grad.addColorStop(parseFloat(String(i / colors.length)), color);
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1, steps);
    this.palette = ctx.getImageData(0, 0, 1, steps).data;
  }

  getColor(mix, max, val) {
    let percent;
    if (val <= mix) percent = 0;
    else if (val >= max) percent = 1;
    else percent = (val - mix) / (max - mix);
    let index = Math.floor(percent * (this.steps - 1));

    // 一维数组, 二级指针

    // 二维矩阵,  三级指针, 行偏移, 列偏移, rgb偏移

    // 指针:   color 四位,  index  这个颜色的
    // 首地址, index * 4  这个颜色的 r 值
    // 指针偏移 , index * 4 + 1  这个颜色的 g 值
    // 指针偏移 , index * 4 + 2  这个颜色的 b 值
    return `rgb(${this.palette[index * 4]},${this.palette[index * 4 + 1]},${
      this.palette[index * 4 + 2]
    })`;
  }

  getData(min, max, val) {
    let percent;
    if (val <= min) percent = 0;
    else if (val >= max) percent = 1;
    else percent = (val - min) / (max - min);
    let index = Math.floor(percent * (this.steps - 1));

    return this.palette.slice(index * 4, index * 4 + 4);
  }

  getRatio(value, minMax, levelDict) {

    /*
    minMax [0,100]
    levelDict: 作用: 分段色标, 过度颜色, 0-350 以0,1 步进 在 350 开始, 以0,2 步进, 快速将颜色过度到 420
        {
          0: [0, 50, 0.1],
          0.1: [50, 150, 0.1],
          0.2: [150, 250, 0.1],
          0.3: [250, 350, 0.1],
          0.4: [350, 420, 0.2],
          0.6: [420, 420, null],
          0.8: [420, null, null],
        }
     补充:
     线性色标: linear  平滑过度
     分段色标*: piecewise 当前 ratio 类型 , Piecewise
     对数色标: log 以指数级别过度颜色, 消光系数, 激光雷达

    */

    if (value < 0) {
      return 0.0; // value 小于0 , 直接返回 ratio = 0
    } else {

      let levelMinMax = [
        levelDict[0][0],
        levelDict[0.8][0],
      ];

      // 将 value 从 minMax 映射到 levelMinMax 区间
      let scaleValue = this.scale(value, minMax, levelMinMax);

      for (let ratio in levelDict) {
        let rMinMax = levelDict[ratio];
        let ratioStep = rMinMax[2];

        if (
          rMinMax[1] === null &&
          scaleValue > rMinMax[0]
        ) {
          // ratio 为最大值, 且 value 大于最大值 直接返回该 ratio
          // 最大值
          return ratio; // 0.8
        } else if (
          rMinMax[0] < scaleValue &&
          scaleValue <= rMinMax[1]
        ) {
          // 如果 value 在当前 ratio 的范围内
          return (
            // scaleValue = 300
            // 则: 0.3 + (300 - 250) / (350 - 250) * 0.1 = 0.3 + 0.1 = 0.4
            parseFloat(ratio)
            + ((scaleValue - rMinMax[0]) / (rMinMax[1] - rMinMax[0]))
            * ratioStep
          );
        }
      }
    }


  }

  /**
   * 根据 valueMinMax levelMinMax 缩放 value
   * @param value 当前值
   * @param valueMinMax 当前值的最大最小值
   * @param levelMinMax 比例尺的最大最小值
   * @returns {number|*}
   */
  scale(value, valueMinMax, levelMinMax) {

    let [vMin, vMax] = valueMinMax;
    let [lMin, lMax] = levelMinMax;

    if (valueMinMax) {
      let scaleValue = ((value - vMin) / (vMax - vMin)) * (lMax - lMin);
      if (scaleValue < lMin) return lMin;
      if (scaleValue > lMax) return lMax;
      return scaleValue;
    }
    return value;
  }
}


export function usePalette(colors, min, max, steps = 256) {
  let palette = new Palette(colors, steps);
  return {
    palette: palette,
    getColor(val) {
      return palette.getColor(min, max, val);
    },
    getData(val) {
      return palette.getData(min, max, val);
    },
  };
}

export type UsePalette = ReturnType<typeof usePalette>;
