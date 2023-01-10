function SpatialPainter() {
  /**
   * 初始化颜色版
   */
  this.init = function(conrec) {
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
  };

  this.paintSpatial = function(
    canvas,
    data,
    projection,
    polygons,
    alpha = 0.5,
    conrec = false
  ) {
    try {
      this.init(conrec);
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
      let dlen = d.length;
      let height = canvas.height;
      let width = canvas.width;
      let x1 = 0,
        x2 = width,
        y1 = 0,
        y2 = height;
      //得到点值的二维数组
      let matrixData = [];
      // 根据画布大小, 初始化空矩阵
      for (let i = 0; i <= height; i++) {
        matrixData[i] = [];
        for (let j = 0; j <= width; j++) {
          matrixData[i][j] = "";
        }
      }
      // 根据数据点, 初始化矩阵
      for (let _i = 0; _i < dlen; _i++) {
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
      }
      /**
       * 插值矩阵数据,时间复杂度O(height*width*len)
       *
       */
      for (let _i2 = y1; _i2 <= y2; _i2++) {
        for (let _j = x1; _j <= x2; _j++) {
          if (matrixData[_i2][_j] === "") {
            if (pixPolygons && pixPolygons.length > 0) {
              if (maskData[4 * (_i2 * width + _j)] === 0) {
                continue;
              }
            }
            let sum0 = 0,
              sum1 = 0;
            for (let k = 0; k < dlen; k++) {
              //将点位影响范围限制在500米内，性能下降不可接受
              // let pointlnglat=map.containerToLngLat(new AMap.Pixel(j,i));
              // if(pointlnglat.distance(new AMap.LngLat(d[k].lng,d[k].lat))>500){
              // 	continue;
              // }
              let distance =
                (_i2 - d[k].y) * (_i2 - d[k].y) + (_j - d[k].x) * (_j - d[k].x);
              //distance=Math.pow((i-d[k].y)*(i-d[k].y) + (j-d[k].x)*(j-d[k].x),-2);

              sum0 += (d[k].value * 1.0) / distance;
              sum1 += 1.0 / distance;

              // sum0 += d[k].value*1.0/((i-d[k].y)*(i-d[k].y) + (j-d[k].x)*(j-d[k].x));
              // sum1 += 1.0/((i-d[k].y)*(i-d[k].y) + (j-d[k].x)*(j-d[k].x));
            }
            if (sum1 !== 0) matrixData[_i2][_j] = sum0 / sum1;
            else matrixData[_i2][_j] = 0;
          }
        }
      }

      console.log(matrixData);

      //更新图片数据
      try {
        for (let _i3 = y1; _i3 <= y2; _i3++) {
          for (let _j2 = x1; _j2 <= x2; _j2++) {
            let value = matrixData[_i3][_j2];
            if (value === "") {
              continue;
            }
            let radio = this._getRadioByValue(this.paramName, value);
            //radio=0.8
            // imageData[4 * (_i3 * width + _j2)] =
            //   this.palette[Math.floor(radio * 255 + 1) * 4 - 4];
            // imageData[4 * (_i3 * width + _j2) + 1] =
            //   this.palette[Math.floor(radio * 255 + 1) * 4 - 3];
            // imageData[4 * (_i3 * width + _j2) + 2] =
            //   this.palette[Math.floor(radio * 255 + 1) * 4 - 2];
            // imageData[4 * (_i3 * width + _j2) + 3] = Math.floor(255 * alpha);

            const [r, g, b, a] = data.palette.getData(value);
            const index = (_i3 * width + _j2) * 4;
            imageData[index] = r;
            imageData[index + 1] = g;
            imageData[index + 2] = b;
            imageData[index + 3] = 225 * 0.8;

          }
        }
      } catch (e) {
        console.error(e);
      }
      context.putImageData(image, 0, 0);
      return image;
    } catch (e) {
      console.log("paint spatial error" + e);
    }
  };

  /**
   * 将地理坐标数据转换成画布坐标数据
   * @param data
   * @param projection
   * @returns {*}
   * @private
   */
  this._setSpatialData = function(data, projection) {
    //data:{datas:[{"lat": 40.2929, "value": 21.0, "lng": 116.2266}, {"lat": 39.9301, "value": 16.0, "lng": 116.4233}...]
    //,paramName:"PM10",unit:"ug/m3"}
    if (data === null) {
      return null;
    }
    let _jsonData = data.datas;
    let _jdlen = data.datas.length;
    let _spatialData = [];
    while (_jdlen--) {
      let pixel = projection([_jsonData[_jdlen].lng, _jsonData[_jdlen].lat]);
      _spatialData.push({
        lng: _jsonData[_jdlen].lng,
        lat: _jsonData[_jdlen].lat,
        x: parseInt(pixel[0]),
        y: parseInt(pixel[1]),
        value: _jsonData[_jdlen].value,
      });
    }
    this.paramName = data.paramName;
    this.unit = data.unit;
    return _spatialData;
  };
  this._getRadioByValue = function(param, value) {
    //根据污染物名称和浓度值计算在图例中显示的颜色比例
    let levelDict = this._getParamValueLevelDict(param);

    if (value < 0) {
      return 0.0;
    } else {
      let scaleValue = value;
      scaleValue = this.scale(levelDict, this.minMax, value);
      for (let key in levelDict) {
        if (levelDict[key][1] === null && scaleValue > levelDict[key][0]) {
          //最大值
          return key;
        } else if (
          levelDict[key][0] < scaleValue &&
          scaleValue <= levelDict[key][1]
        ) {
          return (
            parseFloat(key) +
            ((scaleValue - levelDict[key][0]) /
              (levelDict[key][1] - levelDict[key][0])) *
            levelDict[key][2]
          );
        }
      }
    }
  };
  this.scale = function(levelDict, minMax, value) {
    let lo = levelDict[0][0];
    let hi = levelDict[0.8][0];
    if (minMax) {
      let res = ((value - minMax[0]) / (minMax[1] - minMax[0])) * (hi - lo);
      if (res < lo) return lo;
      if (res > hi) return hi;
      return res;
    }
    return value;
  };
  this._getParamValueLevelDict = function(param) {
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
  };

  this._getContecGradientDict = function() {
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
  };
  this._getGradientDict = function() {
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
  };

  /**
   * 将地理坐标映射到屏幕坐标
   * @param projection
   * @param {Array} polygon
   * @returns {Array}
   */
  this.convertPolygon = function(projection, polygon) {
    console.log("convertPolygon");
    let pixPolygon = [];
    for (let i = 0; i < polygon.length; i++) {
      pixPolygon.push(projection([polygon[i][0], polygon[i][1]]));
    }
    return pixPolygon;
  };

  /**
   * 转换多个多边形
   * */
  this.convertPolygons = function(projection, polygons) {
    let pixPolygons = [];
    for (let i = 0; i < polygons.length; i++) {
      let pixPolygon = this.convertPolygon(projection, polygons[i]);
      pixPolygons.push(pixPolygon);
    }
    return pixPolygons;
  };
  /**
   * 绘制多个多边形
   * @param canvas
   * @param polygons
   */
  this.drawPolygons = function(canvas, polygons) {
    for (let i = 0; i < polygons.length; i++) {
      this.drawPolygon(canvas, polygons[i]);
    }
  };

  /**
   * 绘制多边形
   * @param canvas
   * @param polygon
   */
  this.drawPolygon = function(canvas, polygon) {
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
  };
  /**
   * 判断该点在不在多边形内（过时）
   * @param point {Array}
   * @param polygon {Array}
   * @returns {boolean}
   * @summary 多边形数据较大时，性能损耗严重，暂不使用
   */
  this.pnpoly = function(point, polygon) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    let x = point[0],
      y = point[1];

    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = polygon[i][0],
        yi = polygon[i][1];
      let xj = polygon[j][0],
        yj = polygon[j][1];

      let intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  };
}

function createCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function getProjection(center, scale, size) {
  return d3
    .geoMercator()
    .center(center)
    .scale(scale)
    .translate([size[0] / 2, size[1] / 2]);
}

function getProjectionFitSize(size, features) {
  // features = turf.featureCollection(points);
  // 扩展: fitExtent
  // https://stackoverflow.com/questions/55972289/how-can-i-scale-my-map-to-fit-my-svg-size-with-d3-and-geojson-path-data
  return d3.geoMercator().fitSize([size[0], size[1]], features);
}

function getProjectionFitSizeBbox(size, bbox) {
  let sw = [bbox[0], bbox[1]];
  let ne = [bbox[2], bbox[3]];
  // features = turf.featureCollection(points);
  // 扩展: fitExtent
  // https://stackoverflow.com/questions/55972289/how-can-i-scale-my-map-to-fit-my-svg-size-with-d3-and-geojson-path-data
  return d3.geoMercator().fitSize(
    [size[0], size[1]],
    {
      type: "FeatureCollection",
      features: [
        {type: "Feature", geometry: {type: "Point", coordinates: [sw[0], sw[1]]}},
        {type: "Feature", geometry: {type: "Point", coordinates: [ne[0], ne[1]]}}]
    });
}

class Palette {
  constructor(colors, steps = 256) {
    this.colors = colors;
    this.steps = steps;
    let canvas = createCanvas(1, steps);
    let ctx = canvas.getContext("2d");
    let grad = ctx.createLinearGradient(0, 0, 1, steps);

    for (let i = 0; i < colors.length; i++) {
      const color = colors[i];
      grad.addColorStop(parseFloat(i / colors.length), color);
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1, steps);
    const palette = ctx.getImageData(0, 0, 1, steps).data;
    this.palette = palette;
  }

  getColor(mix, max, val) {
    let percen;
    if (val <= mix) percen = 0;
    else if (val >= max) percen = 1;
    else percen = (val - mix) / (max - mix);
    let index = Math.floor(percen * (this.steps - 1));

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
    let percen;
    if (val <= min) percen = 0;
    else if (val >= max) percen = 1;
    else percen = (val - min) / (max - min);
    let index = Math.floor(percen * (this.steps - 1));

    return this.palette.slice(index * 4, index * 4 + 4);
  }
}

function usePalette(colors, min, max, steps = 256) {
  let palette = new Palette(colors, steps);
  return {
    palette,
    getColor(val) {
      return palette.getColor(min, max, val);
    },
    getData(val) {
      return palette.getData(min, max, val);
    },
  };
}

function insertMatrix(matrix, pixPoints) {
  for (let y = 0; y < matrix.length; y++) {
    const row = matrix[y];
    for (let x = 0; x < row.length; x++) {
      const v = row[x];
      if (v !== null) {
        continue;
      }
      let sum0 = 0;
      let sum1 = 0;
      for (let k = 0; k < pixPoints.length; k++) {
        const point = pixPoints[k];
        let distance =
          (y - point.y) * (y - point.y) + (x - point.x) * (x - point.x);

        sum0 += point.value / distance;
        sum1 += 1 / distance;
      }

      if (sum1 !== 0) {
        matrix[y][x] = (sum0 / sum1).toFixed(2);
      } else {
        matrix[y][x] = 0;
      }
    }
  }
  return matrix;
}

function pointsProjection(points, projection) {
  return points.map((p) => {
    let [x, y] = projection([p.lng, p.lat]);
    return Object.assign(p, {
      x: parseInt(x),
      y: parseInt(y),
    });
  });
}

// 矩阵可视化
function showMatrixTable(matrix, getColor) {
  // 根据
  let table = document.createElement("table");
  // table.border = "1";
  table.style.borderCollapse = "collapse";
  table.style.border = "1px solid #ccc";
  // table.style.margin = "10px";
  table.style.textAlign = "center";

  for (let i = 0; i < matrix.length; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < matrix[i].length; j++) {
      let td = document.createElement("td");
      td.innerText = parseFloat(matrix[i][j]).toFixed(2) || "x";
      // td.innerHTML = "&nbsp;";
      td.style.backgroundColor = matrix[i][j]
        ? getColor(matrix[i][j])
        : "white";
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  document.body.appendChild(table);
}

// 矩阵可视化
function showMatrixCanvas(matrix, getData) {
  // 根据
  const width = matrix[0].length;
  const height = matrix.length;

  const canvas = createCanvas(width, height);

  const context = canvas.getContext("2d");

  const image = context.createImageData(canvas.width, canvas.height);
  const imageData = image.data;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const value = matrix[i][j];
      const [r, g, b, a] = getData(value);
      const index = (i * width + j) * 4;
      imageData[index] = r;
      imageData[index + 1] = g;
      imageData[index + 2] = b;
      imageData[index + 3] = 225 * 0.6;
    }
  }
  context.putImageData(image, 0, 0);

  document.body.appendChild(canvas);
  return canvas;
}

function createMatrix(width, height) {
  let matrix = [];
  for (let i = 0; i < height; i++) {
    matrix.push([]);
    for (let j = 0; j < width; j++) {
      matrix[i].push(null);
    }
  }
  return matrix;
}

function fillMatrix(matrix, pixPoints) {
  for (let i = 0; i < pixPoints.length; i++) {
    const point = pixPoints[i];
    if (
      point.x > 0 &&
      point.y > 0 &&
      point.x < matrix.length &&
      point.y < matrix[0].length
    ) {
      matrix[point.y][point.x] = point.value;
    }
  }
  return matrix;
}

function getRadio(value) {
  let levelDict = {
    0: [0, 100, 0.1],
    0.1: [100, 160, 0.1],
    0.2: [160, 215, 0.1],
    0.3: [215, 265, 0.1],
    0.4: [265, 800, 0.2],
    0.6: [800, 800, null],
    0.8: [800, null, null],
  };

  const getScale = (levelDict, minMax, value) => {
    let lo = levelDict[0][0];
    let hi = levelDict[0.8][0];
    if (minMax) {
      let res = ((value - minMax[0]) / (minMax[1] - minMax[0])) * (hi - lo);
      if (res < lo) return lo;
      if (res > hi) return hi;
      return res;
    }
    return value;
  };

  if (value < 0) {
    return 0.0;
  } else {
    let scaleValue = value;
    scaleValue = getScale(levelDict, [1, 420], value);
    console.log("scaleValue: ", scaleValue);
    for (let key in levelDict) {
      if (levelDict[key][1] === null && scaleValue > levelDict[key][0]) {
        //最大值
        return key;
      } else if (
        levelDict[key][0] < scaleValue &&
        scaleValue <= levelDict[key][1]
      ) {
        return (
          parseFloat(key) +
          ((scaleValue - levelDict[key][0]) /
            (levelDict[key][1] - levelDict[key][0])) *
          levelDict[key][2]
        );
      }
    }
  }
}

function getDistance(paths) {
  let from = turf.point(paths[0]);
  let to = turf.point(paths[1]);
  let options = {units: "kilometers"};

  let distance = turf.rhumbDistance(from, to, options);
  return distance;
}

function fetchJson(url) {
  return fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Network response was not ok.");
  });
}

async function getBboxByCode(code = "100000") {
  let code_json = await fetchJson("https://geo.datav.aliyun.com/areas_v3/bound/" + code + ".json");
  let code_bbox;
  // console.log(code_json);
  let cn_paths = code_json.features[0].geometry.coordinates.flat(2);
  let cn_line = turf.lineString(cn_paths);
  code_bbox = turf.bbox(cn_line);
  console.log(code + "_bbox: ", code_bbox);
  return code_bbox;
}

async function getBoundPathsByCode(code, flatDeep = 0) {
  let code_json = await fetchJson("https://geo.datav.aliyun.com/areas_v3/bound/" + code + ".json");
  let code_paths = code_json.features[0].geometry.coordinates.flat(flatDeep);
  console.log(code + "_paths: ", code_paths);
  return code_paths;
}

function bboxToCollection(bbox) {
  let leftBottom = [bbox[0], bbox[1]];
  let rightTop = [bbox[2], bbox[3]];
  let bboxCollection = turf.featureCollection([leftBottom, rightTop].map(turf.point));
  return bboxCollection;
}

// 开尔文转摄氏度 javascript
function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}


/**
 *
 * @param view
 * @param eventName
 * @param layers layer Or layers
 * @param callback
 * @param outCallback
 * @returns {*}
 */
function viewOn(view, eventName, layers, callback, outCallback) {

  if (!(layers instanceof Array)) {
    layers = [layers];
  }

  return view.on(eventName, (e) => {
    view.hitTest(e).then(function(response) {
      let results = response.results;
      let graphics = results.filter(function(result) {
        // check if the graphic belongs to the layer of interest
        return layers.some(layer => layer === result.graphic.layer);
      });
      if (graphics.length > 0) {
        callback && callback(graphics, e);
      } else {
        outCallback && outCallback();
      }
    });

  });

}
