// ======== canvas 绘制激光雷达图


import {UsePalette, usePalette} from "./palette";
import {flipImageData, linearInterpolate, repeatImageData, transposeImageData} from "./canvas.util";

export interface LidarData {

  // ==== 附加数据

  // 开始点, 结束点
  points: [[number, number], [number, number]];
  // 时间点, 结束点
  time: string;
  // 每个数值的高度
  heightList: number[];

  // === 渲染数据
  data: number[];
}

export interface LidarImageOption {
  data: LidarData,
  colors: string[],
  minMax: [number, number]
}

// 雷达图 图片
export abstract class LidarImageBase {

  // 图例 渲染数据
  readonly colors: string[];
  // 图例 最大最小值, 外部可看, 只能内部修改
  private _minMax: [number, number];
  public get minMax() {
    return this._minMax;
  }

  protected set minMax(value: [number, number]) {
    this._minMax = value;
  }

  // 调色板
  protected palette: UsePalette;

  // 图片大小
  abstract readonly width: number;
  abstract readonly height: number;

  // 源数据
  readonly data: LidarData;

  protected constructor(option: LidarImageOption) {
    this.colors = option.colors;
    this.minMax = option.minMax;
    this.data = option.data;
    this.palette = usePalette(this.colors, this.minMax[0], this.minMax[1]);

  }

  // 获取图片
  abstract getImage(): string;

  // 根据 yIndex 获取值, 获取某个 高度像素点的值 (插值后的)
  abstract getValue(yIndex: number): number;
}


// 雷达图 竖直渐变

interface LidarImageRectOption extends LidarImageOption {
  readonly width: number;
  readonly height: number;
}

export class LidarImageRect extends LidarImageBase {

  private canvas: HTMLCanvasElement = document.createElement("canvas");

  // 数据
  private readonly arr: number[];

  // 是否初始化
  private isCache: boolean = false;
  // 高度 矩形图片
  private rectMap = new Map<number, HTMLCanvasElement>();
  // 用于 获取值
  private dataList: number[] = [];
  // 获取颜色
  private dataColors: Uint8ClampedArray[];
  // 插值 高度
  private heightArr: number[];

  readonly width: number;
  readonly height: number;

  constructor(option: LidarImageRectOption) {
    super(option);
    this.arr = this.data.data;
    this.width = option.width;
    this.height = option.height;

    this._render();
    this.isCache = true;
  }

  getImage() {
    if (!this.isCache) {
      this._render();
      this.isCache = true;
    }
    return this.canvas.toDataURL();
  }

  getCanvas() {
    if (!this.isCache) {
      this._render();
      this.isCache = true;
    }
    return this.canvas;
  }

  /**
   * 获取某个像素的颜色
   * @param yIndex
   */
  getColor(yIndex: number) {
    if (!this.isCache) {
      this._render();
      this.isCache = true;
    }
    return this.dataColors[yIndex];
  }

  /**
   * 获取某个像素的值
   * @param yIndex
   */
  getValue(yIndex: number): number {
    if (!this.isCache) {
      this._render();
      this.isCache = true;
    }
    return this.dataList[yIndex];
  }

  /**
   * 获取某个像素的高度
   * @param yIndex
   */
  getHeight(yIndex) {
    if (!this.isCache) {
      this._render();
      this.isCache = true;
    }
    return this.heightArr[yIndex];
  }
  /**
   * 获取某个高度的矩形图片
   * @param yIndex
   */
  getRectB64(yIndex: number) {

    if(this.rectMap.has(yIndex)) {
      return this.rectMap.get(yIndex);
    }

    let color = this.getColor(yIndex);
    // 创建一个 10 * 10 的 canvas
    let canvas = document.createElement("canvas");
    canvas.width = 10;
    canvas.height = 10;
    let ctx = canvas.getContext("2d");
    let imageData = ctx.createImageData(10, 10);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = color[0];
      data[i + 1] = color[1];
      data[i + 2] = color[2];
      data[i + 3] = color[3];
    }
    ctx.putImageData(imageData, 0, 0);
    this.rectMap.set(yIndex, canvas);
    return canvas;
  }


  // 插值后的数据
  getData() {
    if (!this.isCache) {
      this._render();
      this.isCache = true;
    }
    return this.dataList;
  }
  // 插值后的高度
  getHeightArr() {
    if (!this.isCache) {
      this._render();
      this.isCache = true;
    }
    return this.heightArr;
  }



  // 获取源数据
  getInfo() {
    return this.data;
  }

  setMinMax(minMax: [number, number]) {
    this.minMax = minMax;
    this.clearCache();
    this.palette = usePalette(this.colors, this.minMax[0], this.minMax[1]);
  }

  private clearCache() {
    this.isCache = false;
    this.rectMap.clear();
  }

  private _render() {


    let heightList = this.data.heightList;
    let minHeight = 0;
    let maxHeight = heightList[heightList.length - 1];
    // 高度信息插值
    let heightArr: number[] = [];
    let count = this.height;
    let step2 = (maxHeight - minHeight) / count;
    for (let i = 0; i < count; i++) {
      heightArr.push(minHeight + i * step2);
    }
    this.heightArr = heightArr;


    // 创建同画布大小矩阵数据
    let canvasWidth = this.height;  // 绘制水平柱子, 后续转置宽高
    let canvasHeight = 1;
    let matrixData: number[][] = [];
    for (let i = 0; i < canvasHeight; i++) {
      matrixData[i] = [];
      for (let j = 0; j < canvasWidth; j++) {
        matrixData[i][j] = undefined;
      }
    }

    // 将数据填充入画布矩阵
    let step = canvasWidth / this.arr.length;
    for (let i = 0; i < this.arr.length; i++) {
      let x = Math.floor(i * step);
      let y = 0;

      // 处理最后一个点, 否则插值会有空白
      if (i == this.arr.length - 1) {
        if (x != canvasWidth - 1) {
          x = canvasWidth - 1;
        }
      }

      matrixData[y][x] = this.arr[i];
    }

    // 对 matrixData 插值
    let nextMatrixData: number[][] = [];
    for (let i = 0; i < matrixData.length; i++) {
      let row = matrixData[i];
      let newRow = linearInterpolate(row);
      nextMatrixData.push(newRow);
    }

    this.dataList = nextMatrixData[0];


    let colors: Uint8ClampedArray[] = [];
    // 将二维数组转为一维数组
    // 根据 matrixData 和 palette 填充 imageData
    let nextData = nextMatrixData.flat();
    let imageData = new ImageData(canvasWidth, 1);
    let data = imageData.data;
    for (let i = 0; i < nextData.length; i++) {
      let val = nextData[i];
      let color = this.palette.getData(val);

      let index = i * 4;
      data[index] = color[0];
      data[index + 1] = color[1];
      data[index + 2] = color[2];
      data[index + 3] = 255;
      colors.push(color);
    }
    this.dataColors = colors.reverse();

    let nextImageData = imageData;
    // 垂直翻转
    nextImageData = flipImageData(nextImageData, "vertical");
    // 转置 (宽高互换)
    nextImageData = transposeImageData(nextImageData);
    // 水平重复, 扩展图片宽度
    nextImageData = repeatImageData(nextImageData, this.width, "horizontal");

    this.canvas.width = nextImageData.width;
    this.canvas.height = nextImageData.height;
    // 在画布上显示 imageData
    let context = this.canvas.getContext("2d");
    context.putImageData(nextImageData, 0, 0);

  }

}


// 雷达图 径向渐变

