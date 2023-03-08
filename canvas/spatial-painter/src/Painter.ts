import type {Result} from "./Painter.model";
import type {GeoProjection} from "d3";
import {createCanvas} from "@/util";

type MinMax = [number, number];

type Point = [number, number];
type Path = Point[];
type Polygon = Path;

type XY = Point;
type XYPolygon = XY[];

interface ISpatialData {
  lng: number;
  lat: number;
  x: number;
  y: number;
  value: number;
}

export default class Painter {

  private palette: Uint8ClampedArray;
  minMax: MinMax;
  private paramName: string;


  constructor() {

  }

  initPalette(conrec: boolean) {
    try {
      let _paleCanvas = createCanvas(1, 256);
      let ctx = _paleCanvas.getContext("2d");
      let grad = ctx.createLinearGradient(0, 0, 1, 256);
      let gradient;
      if (conrec) {
        gradient = this._getContecGradientDict();
      } else {
        gradient = this._getGradientDict();
      }
      for (let x in gradient) {
        grad.addColorStop(parseFloat(x), gradient[x]);
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1, 256);
      this.palette = ctx.getImageData(0, 0, 1, 256).data;
    } catch (e) {
      console.log("spatial init error" + e);
    }
  }

  paintSpatial(
    canvas: HTMLCanvasElement,
    data: Result,
    projection: GeoProjection,
    polygons: Polygon[],
    {
      alpha = 0.5,
      conrec = false,
      dataCallback = null,
    }
  ) {

    try {
      this.initPalette(conrec);
      //插值
      //按照画布逐像素点着色
      if (data.min && data.max) {
        this.minMax = [data.min, data.max];
      }
      let _spatialData = this._setSpatialData(data, projection);
      // console.log("_spatialData: ", _spatialData);
      let context = canvas.getContext("2d");
      let image = context.createImageData(canvas.width, canvas.height);
      let imageData = image.data;
      let d = _spatialData;
      let dLen = d.length;
      let height = canvas.height;
      let width = canvas.width;
      let x1 = 0,
        x2 = width,
        y1 = 0,
        y2 = height;
      //得到点值的二维数组

      // 根据画布大小, 初始化空矩阵
      // let matrixData = createMatrix(width, height);
      let matrixData: (number | null)[][] = [];
      // 根据画布大小, 初始化空矩阵
      for (let i = 0; i <= height; i++) {
        matrixData[i] = [];
        for (let j = 0; j <= width; j++) {
          matrixData[i][j] = null;
        }
      }
      // 根据数据点, 填充矩阵
      // matrixData = fillMatrix(matrixData, d);
      // 根据数据点, 初始化矩阵
      for (let _i = 0; _i < dLen; _i++) {
        let point = d[_i];
        // if (x1 <= point.x && point.x <= x2 && y1 <= point.y && point.y <= y2) {
        //仅在需要画图的区域初始化监测点数据
        matrixData[point.y][point.x] = point.value;
        // }
      }

      // console.log("matrixData: ", matrixData);
      let pixPolygons;
      let maskData = null;
      //使用遮罩绘制地图轮廓，填充红色，通过判断遮罩颜色确定数据点是否在多边形内
      if (polygons && polygons.length !== 0) {
        pixPolygons = this.convertPolygons(projection, polygons);
        let maskCanvas = createCanvas(canvas.width, canvas.height);
        this.drawPolygons(maskCanvas, pixPolygons);
        let maskContext = maskCanvas.getContext("2d");
        maskData = maskContext.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        ).data;
        document.body.appendChild(maskCanvas);
      }
      /**
       * 插值矩阵数据,时间复杂度O(height*width*len)
       *
       */
      for (let _i2 = y1; _i2 <= y2; _i2++) {
        for (let _j = x1; _j <= x2; _j++) {
          let value = matrixData[_i2][_j];
          if (value === null) {
            if (pixPolygons && pixPolygons.length > 0) {
              if (maskData[4 * (_i2 * width + _j)] === 0) {
                continue;
              }
            }
            let sum0 = 0,
              sum1 = 0;
            for (let k = 0; k < dLen; k++) {
              //将点位影响范围限制在500米内，性能下降不可接受
              // let pointlnglat=map.containerToLngLat(new AMap.Pixel(j,i));
              // if(pointlnglat.distance(new AMap.LngLat(d[k].lng,d[k].lat))>500){
              // 	continue;
              // }
              let distance =
                (_i2 - d[k].y) * (_i2 - d[k].y) + (_j - d[k].x) * (_j - d[k].x);
              //distance=Math.pow((i-d[k].y)*(i-d[k].y) + (j-d[k].x)*(j-d[k].x),-2);

              sum0 += d[k].value / distance;
              sum1 += 1.0 / distance;

              // sum0 += d[k].value*1.0/((i-d[k].y)*(i-d[k].y) + (j-d[k].x)*(j-d[k].x));
              // sum1 += 1.0/((i-d[k].y)*(i-d[k].y) + (j-d[k].x)*(j-d[k].x));
            }
            if (sum1 !== 0) {
              matrixData[_i2][_j] = sum0 / sum1;
            } else {
              matrixData[_i2][_j] = 0;
            }
          }
        }
      }


      console.log(matrixData);

      if (dataCallback) {
        dataCallback(matrixData);
      }


      //更新图片数据
      try {
        for (let _i3 = y1; _i3 <= y2; _i3++) {
          for (let _j2 = x1; _j2 <= x2; _j2++) {
            let value = matrixData[_i3][_j2];
            if (value === null) {
              continue;
            }
            let ratio: number = this._getRatioByValue(this.paramName, value);
            // ratio=1
            imageData[4 * (_i3 * width + _j2)] =
              this.palette[Math.floor(ratio * 255 + 1) * 4 - 4];
            imageData[4 * (_i3 * width + _j2) + 1] =
              this.palette[Math.floor(ratio * 255 + 1) * 4 - 3];
            imageData[4 * (_i3 * width + _j2) + 2] =
              this.palette[Math.floor(ratio * 255 + 1) * 4 - 2];
            imageData[4 * (_i3 * width + _j2) + 3] = Math.floor(255 * alpha);

            // const [r, g, b, a] = data.palette.getData(value);
            // const index = (_i3 * width + _j2) * 4;
            // imageData[index] = r;
            // imageData[index + 1] = g;
            // imageData[index + 2] = b;
            // imageData[index + 3] = 225 * 0.8;

          }
        }

        // showMatrixCanvas(matrixData, palette.getData);
        // showMatrixTable(matrixData, palette.getColor);
        //
        // return;


      } catch (e) {
        console.error(e);
      }
      context.putImageData(image, 0, 0);
      return image;
    } catch (e) {
      console.log("paint spatial error" + e);
    }
  }

  private _getContecGradientDict() {
    return {
      0: "#00deff", //蓝色 0
      0.099: "#00deff",
      0.1: "#00ff32", //绿色 50
      0.199: "#00ff32", //绿色 50
      0.2: "#ffdc00", //黄色 100
      0.299: "#ffdc00", //黄色 100
      0.3: "#F06C19", //橙色 150
      0.399: "#F06C19", //橙色 150
      0.4: "#FF0000", //红色 200
      0.599: "#FF0000", //红色 200
      0.6: "#87004C", //紫色 300
      0.799: "#87004C", //紫色 300
      0.8: "#7E0023", //褐红 400
      0.999: "#7E0023", //褐红 400
      1.0: "rgb(111,4,116)",
    };
  }

  private _getGradientDict() {
    //AQI颜色标记字典(依据IAQI比例分级)
    /*
 return {
 0: "rgb(0,200,255)", //蓝色 0
 0.1: "rgb(0,228,0)", //绿色 50
 0.2: "rgb(255,255,0)", //黄色 100
 0.3: "rgb(255,126,0)", //橙色 150
 0.4: "rgb(255,0,0)", //红色 200   //当正好渲染此颜色时图片上有麻点，不知道原因未解决
 0.6: "rgb(153,0,76)", //紫色 300
 0.8: "rgb(126,0,35)", //褐红 400
 1.0: "rgb(126,0,35)"
 };
 */
    return {
      0: "#00deff", //蓝色 0
      0.1: "#00ff32", //绿色 50
      0.2: "#ffdc00", //黄色 100
      0.3: "rgb(240,108,25)", //橙色 150
      0.4: "rgb(255,0,0)", //红色 200
      0.6: "rgb(153,0,76)", //紫色 300
      0.8: "rgb(126,0,35)", //褐红 400
      1.0: "rgb(111,4,116)",
    };
    /*return {
    0: "#00ff32",
    0.099: "#00ff32",
    0.1: "#ffdc00",
    0.199: "#ffdc00",
    0.2: "#f06c19",
    0.299: "#f06c19",
    0.3: "#ff0000",
    0.399: "#ff0000",
    0.4: "#99004c",
    0.599: "#99004c",
    0.6: "#7e0024",
    0.699: "#7e0024",
    0.8: "rgb(126,0,35)",
    1.0: "rgb(111,4,116)"
};*/
  }

  private _setSpatialData(data: Result, projection: GeoProjection) {
    //data:{datas:[{"lat": 40.2929, "value": 21.0, "lng": 116.2266}, {"lat": 39.9301, "value": 16.0, "lng": 116.4233}...]
    //,paramName:"PM10",unit:"ug/m3"}
    if (data === null) {
      return null;
    }
    let _jsonData = data.datas;
    let _jdlen = data.datas.length;
    let _spatialData: ISpatialData[] = [];
    while (_jdlen--) {
      let pixel = projection([_jsonData[_jdlen].lng, _jsonData[_jdlen].lat]);
      _spatialData.push({
        lng: _jsonData[_jdlen].lng,
        lat: _jsonData[_jdlen].lat,
        x: parseInt(String(pixel[0])),
        y: parseInt(String(pixel[1])),
        value: _jsonData[_jdlen].value,
      });
    }
    this.paramName = data.paramName;
    return _spatialData;
  }

  private convertPolygons(projection: GeoProjection, polygons: Polygon[]) {
    let pixPolygons: XYPolygon[] = [];
    for (let i = 0; i < polygons.length; i++) {
      let polygon = polygons[i];
      let pixPolygon = this.convertPolygon(projection, polygon);
      pixPolygons.push(pixPolygon);
    }
    return pixPolygons;
  }

  private convertPolygon(projection: GeoProjection, polygon: Polygon) {
    // console.log("convertPolygon");
    let pixPolygon: XYPolygon = [];
    for (let i = 0; i < polygon.length; i++) {
      let point = polygon[i];
      let xy = projection(point);
      pixPolygon.push(xy);
    }
    return pixPolygon;
  }

  private drawPolygons(canvas: HTMLCanvasElement, polygons: XYPolygon[]) {
    for (let i = 0; i < polygons.length; i++) {
      this.drawPolygon(canvas, polygons[i]);
    }
  }

  private drawPolygon(canvas: HTMLCanvasElement, polygon: XYPolygon) {
    let context = canvas.getContext("2d");
    if (polygon && polygon.length > 3) {
      context.beginPath();
      context.moveTo(polygon[0][0], polygon[0][1]);
      for (let i = 1; i < polygon.length; i++) {
        context.lineTo(polygon[i][0], polygon[i][1]);
      }
      context.closePath();
      context.fillStyle = "red";
      context.fill();
    }
  }

  private _getRatioByValue(param: string, value: number) {
    //根据污染物名称和浓度值计算在图例中显示的颜色比例
    let levelDict = this._getParamValueLevelDict(param);

    if (value < 0) {
      return 0.0;
    } else {
      let scaleValue;
      scaleValue = this.scale(levelDict, this.minMax, value);

      for (let key in levelDict) {
        if (
          levelDict[key][1] === null &&
          scaleValue > levelDict[key][0]
        ) {
          //最大值
          return +key;
        } else if (
          levelDict[key][0] < scaleValue &&
          scaleValue <= levelDict[key][1]
        ) {
          return (
            parseFloat(key)
            + ((scaleValue - levelDict[key][0]) / (levelDict[key][1] - levelDict[key][0]))
            * levelDict[key][2]
          );
        }
      }
    }
  }

  private _getParamValueLevelDict(param: string) {
    //根据污染物名称获取分级比例字典
    //格式[起始浓度,终止浓度,下一等级与当前等级的比例差] ,0.6的起始和终止值一样为了在iaqi>300后快速过度到0.8颜色
    if (param === "AQI") {
      return {
        0: [0, 50, 0.1],
        0.1: [50, 100, 0.1],
        0.2: [100, 200, 0.1],
        0.3: [200, 300, 0.1],
        0.4: [300, 500, 0.2],
        0.6: [500, 500, null],
        0.8: [500, null, null],
      }; //更高的值颜色不变
    } else if (param === "PM10") {
      return {
        0: [0, 50, 0.1],
        0.1: [50, 150, 0.1],
        0.2: [150, 250, 0.1],
        0.3: [250, 350, 0.1],
        0.4: [350, 420, 0.2],
        0.6: [420, 420, null],
        0.8: [420, null, null],
      }; //更高的值颜色不变
    } else if (param === "PM2_5") {
      return {
        0: [0, 35, 0.1],
        0.1: [35, 75, 0.1],
        0.2: [75, 115, 0.1],
        0.3: [115, 150, 0.1],
        0.4: [150, 250, 0.2],
        0.6: [250, 250, null],
        0.8: [250, null, null],
      }; //更高的值颜色不变
    } else if (param === "SO2") {
      return {
        0: [0, 150, 0.1],
        0.1: [150, 500, 0.1],
        0.2: [500, 650, 0.1],
        0.3: [650, 800, 0.1],
        0.4: [800, 1600, 0.2],
        0.6: [1600, 1600, null],
        0.8: [1600, null, null],
      }; //更高的值颜色不变
    } else if (param === "SO2_D") {
      return {
        0: [0, 50, 0.1],
        0.1: [50, 150, 0.1],
        0.2: [150, 475, 0.1],
        0.3: [475, 800, 0.1],
        0.4: [800, 1600, 0.2],
        0.6: [1600, 1600, null],
        0.8: [1600, 1600, null],
      }; //更高的值颜色不变
    } else if (param === "NO2") {
      return {
        0: [0, 100, 0.1],
        0.1: [100, 200, 0.1],
        0.2: [200, 700, 0.1],
        0.3: [700, 1200, 0.1],
        0.4: [1200, 2340, 0.2],
        0.6: [2340, 2340, null],
        0.8: [2340, null, null],
      }; //更高的值颜色不变
    } else if (param === "NO2_D") {
      return {
        0: [0, 40, 0.1],
        0.1: [40, 80, 0.1],
        0.2: [80, 180, 0.1],
        0.3: [180, 280, 0.1],
        0.4: [280, 565, 0.2],
        0.6: [565, 565, null],
        0.8: [565, null, null],
      }; //更高的值颜色不变
    } else if (param === "CO") {
      return {
        0: [0, 5, 0.1],
        0.1: [5, 10, 0.1],
        0.2: [10, 35, 0.1],
        0.3: [35, 60, 0.1],
        0.4: [60, 90, 0.2],
        0.6: [90, 90, null],
        0.8: [90, null, null],
      }; //更高的值颜色不变
    } else if (param === "CO_D") {
      return {
        0: [0, 2, 0.1],
        0.1: [2, 4, 0.1],
        0.2: [4, 14, 0.1],
        0.3: [14, 24, 0.1],
        0.4: [24, 36, 0.2],
        0.6: [36, 36, null],
        0.8: [36, null, null],
      }; //更高的值颜色不变
    } else if (param === "O3") {
      return {
        0: [0, 160, 0.1],
        0.1: [160, 200, 0.1],
        0.2: [200, 300, 0.1],
        0.3: [300, 400, 0.1],
        0.4: [400, 800, 0.2],
        0.6: [800, 800, null],
        0.8: [800, null, null],
      }; //更高的值颜色不变
    } else if (param === "O3_8H") {
      return {
        0: [0, 100, 0.1],
        0.1: [100, 160, 0.1],
        0.2: [160, 215, 0.1],
        0.3: [215, 265, 0.1],
        0.4: [265, 800, 0.2],
        0.6: [800, 800, null],
        0.8: [800, null, null],
      }; //更高的值颜色不变
    } else if (param === "test") {
      return {
        0: [0, 100, 0.1],
        0.1: [100, 160, 0.1],
        0.2: [160, 215, 0.1],
        0.3: [215, 265, 0.1],
        0.4: [265, 800, 0.2],
        0.6: [800, 800, null],
        0.8: [800, null, null],
      }; //更高的值颜色不变
    }
  }

  private scale(levelDict, minMax, value: number) {
    let lo = levelDict[0][0];
    let hi = levelDict[0.8][0];
    if (minMax) {
      let res = ((value - minMax[0]) / (minMax[1] - minMax[0])) * (hi - lo);
      if (res < lo) return lo;
      if (res > hi) return hi;
      return res;
    }
    return value;
  }
}
