function chunk(arr, size) {
  var result = [];
  for (var i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}


function createCanvas(width, height, id) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.id = id;
  return canvas;
}

// let 定义: 角度偏移

function Painter() {
  /**
   *  @param {HTMLCanvasElement} canvas
   *  @param {Object} center 圆心坐标
   *  @param {Number} radius 圆半径
   *  @param {Array} palette 颜色表
   *  @param {Number} rotate 圆心偏移角度
   *  @param {Array} data 数据
   *  @param {Number} showDataLength 展示数据长度
   */
  this.paintLidar = function (canvas, center, radius, palette, rotate,data, showDataLength, ) {
    let context = canvas.getContext('2d');
    // context.imageSmoothingEnabled = true;
    context.clearRect(0, 0, canvas.width, canvas.height);
    // 1.绘制底图
    context.fillStyle = 'rgba(42,0,73,0.4)';
    context.fillStyle = 'rgba(0,0,0,1)';
    context.beginPath();
    context.moveTo(center.x, center.y);
    context.arc(
      center.x, center.y, radius, // 中心点, 半径
      (data[0].Heading + rotate) * Math.PI / 180, // 起始角度
      (data[data.length - 1].Heading + rotate) * Math.PI / 180, // 结束角度
    );
    context.closePath();
    context.fill();

    // 2.绘制雷达扇形
    for (let d = 0; d < data.length; d++) {
      let beam = data[d];
      //设置渐变
      let grd = context.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);
      for (let i = 0; i < showDataLength; i++) {
        let value = beam.Datas[i];
        // TODO: 设置颜色系数
        let index = Math.floor(value * 256);
        if (index < 0)
          index = 0;
        if (index > 255)
          index = 255;
        let color = 'rgba(' + palette[index * 4] + ',' + palette[index * 4 + 1] + ',' + palette[index * 4 + 2] + ',' + 1 + ')';
        grd.addColorStop(i / showDataLength, color);
      }
      context.fillStyle = grd;
      //绘制扇形
      context.beginPath();
      context.moveTo(center.x, center.y);
      let stopAngle = beam.Heading + rotate;
      if (d < data.length - 1)
        stopAngle = data[d + 1].Heading + rotate;
      context.arc(center.x, center.y, radius, (beam.Heading + rotate) * Math.PI / 180, stopAngle * Math.PI / 180);
      context.closePath();
      context.fill();
    }
  }
}



function SpatialPainter() {
  /**
   * 初始化颜色版
   */
  this.init = function (pName, conrec) {
    try {
      //    var dddd= this.AQIName;
      let _paleCanvas = createCanvas(1, 256);
      let ctx = _paleCanvas.getContext("2d");
      let grad = ctx.createLinearGradient(0, 0, 1, 255);
      let gradient;
      if (conrec) {
        gradient = this._getContecGradientDict(pName);
      } else {
        gradient = this._getGradientDict();
      }
      for (let x in gradient) {
        grad.addColorStop(parseFloat(x), gradient[x]);
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1, 255);
      this.palette = ctx.getImageData(0, 0, 1, 255).data;
    } catch (e) {
      //console.log('spatial init error'+e);
    }
  };

  this.paintSpatial = function (
    canvas,
    data,
    projection,
    polygons,
    alpha = 0.5,
    conrec = false
  ) {
    try {
      debugger;
      this.init(data.paramName, conrec);
      //插值
      //按照画布逐像素点着色

      var valuePoint= this._getParamValueMaxMin(data.paramName);
      var valueMin=valuePoint[0];
      var valueMax=valuePoint[1];
      //    if (valueMin && valueMax) {
      this.minMax = [valueMin, valueMax];
      // }
      // if (data.min && data.max) {
      //     this.minMax = [data.min, data.max];
      // }
      // //console.log(data);
      let _spatialData = this._setSpatialData(data, projection);
      // //console.log(_spatialData);
      let context = canvas.getContext("2d");
      let image = context.createImageData(canvas.width, canvas.height);
      let imgData = image.data;
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
      for (let i = 0; i <= height; i++) {
        matrixData[i] = [];
        for (let j = 0; j <= width; j++) {
          matrixData[i][j] = "";
        }
      }
      for (let _i = 0; _i < dlen; _i++) {
        let point = d[_i];
        if (x1 <= point.x && point.x <= x2 && y1 <= point.y && point.y <= y2) {
          //仅在需要画图的区域初始化监测点数据
          matrixData[point.y][point.x] = point.value;
        }
      }
      let pixPolygons;
      let maskData = null;
      //使用遮罩绘制地图轮廓，填充红色，通过判断遮罩颜色确定数据点是否在多边形内
      if (polygons && polygons.length !== 0) {
        pixPolygons = this.convertPolygons(projection, polygons);
        let maskCanvas = createCanvas(canvas.width, canvas.height);
        this.drawPolygons(maskCanvas, pixPolygons);
        let maskContext = maskCanvas.getContext("2d");
        maskData = maskContext.getImageData(0, 0, canvas.width, canvas.height)
          .data;
        // //console.log(pixPolygons);
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
            let IDWNumber = 0;
            for (let k = 0; k < dlen; k++) {
              // if (_i2 - d[k].y > 200 && _j - d[k].x > 200) {
              //     continue;
              // }
              // //将点位影响范围限制在500米内，性能下降不可接受
              // // let pointlnglat=map.containerToLngLat(new AMap.Pixel(j,i));
              // // if(pointlnglat.distance(new AMap.LngLat(d[k].lng,d[k].lat))>500){
              // // 	continue;
              // // }

              // if (
              //     Math.sqrt(
              //         (_i2 - d[k].y) * (_i2 - d[k].y) +
              //         (_j - d[k].x) * (_j - d[k].x)
              //     ) > 200
              // ) {
              //     continue;
              // }
              let distance =
                (_i2 - d[k].y) * (_i2 - d[k].y) + (_j - d[k].x) * (_j - d[k].x);

              // distance=Math.sqrt(distance)*0.03;
              // distance=Math.pow((i-d[k].y)*(i-d[k].y) + (j-d[k].x)*(j-d[k].x),-2);

              sum0 += (d[k].value * 1.0) / distance;
              sum0 = sum0;
              sum1 += 1.0 / distance;

              IDWNumber++;
              // if(IDWNumber>30)
              // break;

              // sum0 += d[k].value*1.0/((i-d[k].y)*(i-d[k].y) + (j-d[k].x)*(j-d[k].x));
              // sum1 += 1.0/((i-d[k].y)*(i-d[k].y) + (j-d[k].x)*(j-d[k].x));
            }
            if (sum1 !== 0)
            {
              matrixData[_i2][_j] = sum0 / sum1;
            }
            else {
              matrixData[_i2][_j] = 0;
            }
          }
        }
      }
      // console.log(matrixData.toString());
      //更新图片数据
      for (let _i3 = y1; _i3 <= y2; _i3++) {
        for (let _j2 = x1; _j2 <= x2; _j2++) {
          if (matrixData[_i3][_j2] === "") {
            continue;
          }
          let radio = this._getRadioByValue(
            this.paramName,
            matrixData[_i3][_j2]
          );
          //radio=0.8
          imgData[4 * (_i3 * width + _j2)] = this.palette[
          Math.floor(radio * 255 + 1) * 4 - 4
            ];
          imgData[4 * (_i3 * width + _j2) + 1] = this.palette[
          Math.floor(radio * 255 + 1) * 4 - 3
            ];
          imgData[4 * (_i3 * width + _j2) + 2] = this.palette[
          Math.floor(radio * 255 + 1) * 4 - 2
            ];
          imgData[4 * (_i3 * width + _j2) + 3] = Math.floor(255 * alpha);
        }
      }
      context.putImageData(image, 0, 0);
      return image;
    } catch (e) {
      //console.log('paint spatial error'+e);
    }
  };

  this.paintContour = function (
    canvas,
    data,
    projection,
    polygons,
    alpha = 0.5
  ) { };
  /**
   * 将地理坐标数据转换成画布坐标数据
   * @param data
   * @param projection
   * @returns {*}
   * @private
   */
  this._setSpatialData = function (data, projection) {
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
      //   console.log(pixel);
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
  this._getRadioByValue = function (param, value) {
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
  this.scale = function (levelDict, minMax, value) {
    // let lo = levelDict[0][0];
    // let hi = levelDict[0.8][0];

    let arr = Object.keys(levelDict);
    let dictLength = arr.length;
    arr.sort(function (x, y) {
      return parseFloat(x) - parseFloat(y);
    });
    let lo = levelDict[0][0];
    var indexDict = arr[dictLength - 1];
    //  let hi = levelDict[1][0];
    let hi = levelDict[indexDict][0];

    if (minMax) {
      let res = ((value - minMax[0]) / (minMax[1] - minMax[0])) * (hi - lo);
      if (res < lo) return lo;
      if (res > hi) return hi;
      return res;
    }
    return value;
  };

  this._getParamValueMaxMin = function (param) {


    if (param === "AQI") {
      return [0,500]
    }
    // else if (param === "PM10") {
    else if (param === "a34002") {

      return [0,600]

      // } else if (param === "PM2_5") {
    } else if (param === "a34004") {
      return [0,500]


      // } else if (param === "SO2") {
    } else if (param === "a21026") {
      return [0,800]

    } else if (param === "a21026_D") {

      return [0,2620]

    }
    // else if (param === "NO2") {
    else if (param === "a21004") {
      return [0,3840]

      // } else if (param === "NO2_D") {
    } else if (param === "a21004_D") {
      return [0,940]

    }
    // else if (param === "CO") {
    else if (param === "a21005") {
      return [0,150]

    } else if (param === "a21005_D") {

      return [0,60]

    }
    // else if (param === "O3") {
    else if (param === "a05024") {
      return [0,1200]

    }
    // else if (param === "O3_8H") {
    else if (param === "a05024_8H") {
      return [0,800]

    }
  };

  this._getParamValueLevelDict = function (param) {
    // return {
    //     // 0: [0, 50, 0.2],
    //     // 0.1: [50, 100, 0.1],
    //     // 0.2: [100, 200, 0.1],
    //     // 0.3: [200, 300, 0.1],
    //     // 0.4: [300, 500, 0.2],
    //     // 0.6: [500, 500, null],
    //     // 0.8: [500, null, null]

    //     0: [0, 50, 0.1],
    //     0.1: [50, 100, 0.1],
    //     // 0.1: [50, 100, 0.1],
    //     0.2: [100, 200, 0.1],
    //     0.3: [150, 200, 0.1],
    //     0.4: [200, 300, 0.1],
    //     // 0.49: [299, 299, 0.1],
    //     0.6: [300, 400, 0.1],
    //     0.8: [400, 500, 0.1],
    //     // 0.6: [500, 500, null],
    //     // 0.8: [500, 600, null],
    //     1: [500, null, 0.2]

    //     // 0: [0, 50, 0.1],
    //     // 0.1: [51, 100, 0.1],
    //     // // 0.1: [50, 100, 0.1],
    //     // 0.2: [101, 200, 0.1],
    //     // 0.3: [151, 200, 0.1],
    //     // 0.4: [201, 300, 0.1],
    //     // // 0.49: [299, 299, 0.1],
    //     // 0.6: [301, 400, 0.2],
    //     // 0.8: [401, 499, 0.2],
    //     // // 0.6: [500, 500, null],
    //     // // 0.8: [500, 600, null],
    //     // 1: [500, null, 0.2]
    // }; //更高的值颜色不变

    // return {
    //     0: [0, 50, 0.1],
    //     0.1: [50, 100, 0.1],
    //     // 0.1: [50, 100, 0.1],
    //     0.2: [100, 150, 0.1],
    //     0.3: [150, 200, 0.1],
    //     0.4: [200, 300, 0.1],
    //     // 0.49: [299, 299, 0.1],
    //     0.6: [300, 400, 0.1],
    //     0.8: [400, 500, 0.1],
    //     // 0.6: [500, 500, null],
    //     // 0.8: [500, 600, null],
    //     1: [501, null, null]
    // }; //更高的值颜色不变



    //根据污染物名称获取分级比例字典
    //格式[起始浓度,终止浓度,下一等级与当前等级的比例差] ,0.6的起始和终止值一样为了在iaqi>300后快速过度到0.8颜色
    if (param === "AQI") {
      return {
        0: [0, 50, 0.1],
        0.1: [50, 100, 0.1],
        // 0.1: [50, 100, 0.1],
        0.2: [100, 150, 0.1],
        0.3: [150, 200, 0.1],
        0.4: [200, 300, 0.1],
        // 0.49: [299, 299, 0.1],
        0.6: [300, 400, 0.1],
        0.8: [400, 500, 0.1],
        // 0.6: [500, 500, null],
        // 0.8: [500, 600, null],
        1: [501, null, null]
      }; //更高的值颜色不变
    }
    // else if (param === "PM10") {
    else if (param === "a34002") {
      return {
        // 0: [0, 50, 0.084],
        // 0.084: [51, 150, 0.084],
        // 0.25: [151, 250, 0.166],
        // 0.417: [251, 350, 0.167],
        // 0.583: [351, 420, 0.166],
        // 0.7: [421, 500, 0.117],
        // 0.833: [501, 600, 0.133],
        // 1: [600, null, 0.167]

        // 0: [0, 50, 0.1],
        // 0.084: [50, 150, 0.1],

        // 0.25: [150, 250, 0.1],
        // 0.417: [250, 350, 0.1],
        // 0.583: [350, 420, 0.1],
        // 0.7: [420, 500, 0.1],
        // 0.833: [500, 600, 0.1],
        // 1: [601, null, null]

        // 0: [0, 50, 0.1],
        // 0.1: [50, 150, 0.1],
        // 0.2: [150, 250, 0.1],
        // 0.3: [250, 350, 0.1],
        // 0.4: [350, 420, 0.2],
        // 0.6: [420, 420, null],
        // 0.8: [420, null, null]

        0: [0, 50, 0.1],
        0.1: [50, 150, 0.1],
        0.2: [150, 250, 0.1],
        0.3: [250, 350, 0.1],
        0.5: [350, 420, 0.1],
        0.7: [420, 500, 0.1],
        0.8: [500, 600, 0.1],
        1: [601, null, null]

        // 0: [0, 50, 0.1],
        // 0.084: [51, 150, 0.1],

        // 0.25: [151, 250, 0.1],
        // 0.417: [251, 350, 0.1],
        // 0.583: [351, 420, 0.1],

        // 0.7: [421, 500, 0.1],
        // 0.833: [501, 600, 0.1],

        // 1: [600, null, 0.2]
      }; //更高的值颜色不变

      // } else if (param === "PM2_5") {
    } else if (param === "a34004") {
      return {
        // 0: [0, 35, 0.1],
        // 0.07: [35, 75, 0.1],
        // 0.15: [75, 115, 0.1],
        // 0.23: [115, 150, 0.1],
        // 0.3: [150, 250, 0.1],
        // 0.5: [250, 350, 0.1],
        // 0.7: [350, 500, 0.1],
        // 1: [501, null, null],

        0: [0, 35, 0.1],
        0.1: [35, 75, 0.1],
        0.2: [75, 115, 0.1],
        0.3: [115, 150, 0.1],
        0.4: [150, 250, 0.1],
        0.5: [250, 350, 0.1],
        0.7: [350, 500, 0.1],
        1: [501, null, null]
      }; //更高的值颜色不变
      // } else if (param === "SO2") {
    } else if (param === "a21026") {
      return {
        // 0: [0, 150, 0.1875],
        // 0.1875: [150, 500, 0.4375],
        // 0.0625: [500, 650, 0.1875],
        // 0.8125: [650, 800, 0.1875],
        // 1: [800, null, 0.2],

        0: [0, 150, 0.1875],
        0.1875: [150, 500, 0.4375],
        0.0625: [500, 650, 0.1875],
        0.8125: [650, 800, 0.1875],
        1: [801, null, 0.2],
      }; //更高的值颜色不变
      // }else if (param === "SO2_D") {
    } else if (param === "SO₂_D") {
      return {
        // 0: [0, 50, 0.019],
        // 0.1: [50, 150, 0.03816],
        // 0.2: [150, 475, 0.125],
        // 0.3: [475, 800, 0.125],
        // 0.4: [800, 1600, 0.305],
        // 0.6: [1600, 2100, 0.191],
        // 0.8: [2100, 2620, 0.199],
        // 1: [2620, null, 0.1]

        0: [0, 50, 0.019],
        0.1: [50, 150, 0.03816],
        0.2: [150, 475, 0.125],
        0.3: [475, 800, 0.125],
        0.4: [800, 1600, 0.305],
        0.6: [1600, 2100, 0.191],
        0.8: [2100, 2620, 0.199],
        1: [2621, null, 0.1],
      }; //更高的值颜色不变
    }
    // else if (param === "NO2") {
    else if (param === "a21004") {
      return {
        // 0: [0, 100, 0.026],
        // 0.0265: [100, 200, 0.026],
        // 0.052: [200, 700, 0.05],
        // 0.1823: [700, 1200, 0.13],
        // 0.3125: [1200, 2340, 0.297],
        // 0.609: [2340, 3090, 0.195],
        // 0.805: [3090, 3840, 0.195],
        // 1: [3840, null, 0.2]

        0: [0, 100, 0.026],
        0.0265: [100, 200, 0.026],
        0.052: [200, 700, 0.05],
        0.1823: [700, 1200, 0.13],
        0.3125: [1200, 2340, 0.297],
        0.609: [2340, 3090, 0.195],
        0.805: [3090, 3840, 0.195],
        1: [3841, null, 0.2],
      }; //更高的值颜色不变
      // } else if (param === "NO2_D") {
    } else if (param === "NO₂_D") {
      return {
        0: [0, 40, 0.0426],
        0.0426: [40, 80, 0.0426],
        0.0851: [80, 180, 0.106],
        0.1915: [180, 280, 0.106],
        0.2979: [280, 565, 0.303],
        0.601: [565, 750, 0.197],
        0.8: [750, 940, 0.202],
        1: [941, null, 0.2],
        // 0: [0, 40, 0.0426],
        // 0.0426: [40, 80, 0.0426],
        // 0.0851: [80, 180, 0.106],
        // 0.1915: [180, 280, 0.106],
        // 0.2979: [280, 565, 0.303],
        // 0.601: [565, 750, 0.197],
        // 0.8: [750, 940, 0.202],
        // 1: [940, null, 0.2]
      }; //更高的值颜色不变
    }
    // else if (param === "a21005") {
    else if (param === "a21005") {
      return {
        0: [0, 5, 0.1],
        0.033: [5, 10, 0.1],
        0.067: [10, 35, 0.1],
        0.2333: [35, 60, 0.1],
        0.4: [60, 90, 0.1],
        0.6: [90, 120, 0.2],
        0.8: [120, 150, 0.2],
        1: [151, null, 0.1],
      }; //更高的值颜色不变
    } else if (param === "CO_D") {
      return {
        0: [0, 2, 0.1],
        0.033: [2, 4, 0.1],
        0.067: [4, 14, 0.1],
        0.233: [14, 24, 0.1],
        0.4: [24, 36, 0.1],
        0.6: [36, 48, 0.2],
        0.8: [48, 60, 0.2],
        1: [61, null, 0.1],
      }; //更高的值颜色不变
    }
    // else if (param === "O3") {
    else if (param === "a05024") {
      return {
        0: [0, 160, 0.1],
        0.133: [160, 200, 0.05],
        0.167: [200, 300, 0.05],
        0.25: [300, 400, 0.1],
        0.33: [400, 800, 0.1],
        0.67: [800, 1000, 0.2],
        0.833: [1000, 1200, 0.2],
        1: [1201, null, 0.1],
      }; //更高的值颜色不变
    }
    // else if (param === "O3_8H") {
    else if (param === "a05024_8H") {
      return {
        0: [0, 100, 0.1],
        0.125: [100, 160, 0.1],
        0.2: [160, 215, 0.1],
        0.26875: [215, 265, 0.1],
        0.33125: [265, 800, 0.2],
        1: [801, null, 0.1],
      }; //更高的值颜色不变
    }
  };

  this._getContecGradientDict = function (param) {
    // return {
    //     0: "#00deff", //蓝色 0
    //     0.099:"#00deff",
    //     0.1: "#00ff32", //绿色 50
    //     0.199: "#00ff32", //绿色 50
    //     0.2: "#ffdc00", //黄色 100
    //     0.299: "#ffdc00", //黄色 100
    //     0.3: "#F06C19", //橙色 150
    //     0.399: "#F06C19", //橙色 150
    //     0.4: "#FF0000", //红色 200
    //     0.599: "#FF0000", //红色 200
    //     0.6: "#87004C", //紫色 300
    //     0.799: "#87004C", //紫色 300
    //     0.8: "#7E0023", //褐红 400
    //     0.999: "#7E0023", //褐红 400
    //     1.0: "rgb(111,4,116)"
    // };

    // 分级渲染
    // return {
    //     0: "#43ce17", //绿色 0优
    //     // 0.05:"#00deff",
    //      0.099: "#43ce17", //绿色 0优
    //     0.1: "#efdc31", //黄色 50良
    //      0.199: "#efdc31", //0
    //     0.2: "#fe7f01", //橙色 100 轻度污染
    //      0.299: "#fe7f01", //黄色 100
    //     0.3: "#ff401a", //橙色 150 中度污染
    //       0.399: "#ff401a", //橙色 150
    //     0.4: "#d20040", //红色 200 重度污染
    //      0.599: "#d20040", //红色 200
    //     0.6: "#9c0a4e", //紫色 300 严重污染
    //     // 0.99: "#9c0a4e", //紫色 300 严重污染
    //     // 0.799: "#87004C", //紫色 300
    //     //  0.8: "#7E0023", //褐红 400
    //     //  0.999: "#7E0023", //褐红 400
    //     // 0.99: "#9c0a4e", //紫色 300 严重污染
    //     // 1.0: "#9c0a4e"
    //     0.98: "#9c0a4e",
    //     0.99: "#9c0a4e",
    //     1.0: "#0D0D0D"
    //     // 1.0: "#0D0D0D"
    // };

    // return {
    //     0: "#43ce17", //绿色 0优
    //     // 0.05:"#00deff",
    //      0.09999: "#43ce17", //绿色 0优
    //     0.1: "#efdc31", //黄色 50良
    //      0.199: "#efdc31", //0
    //     0.2: "#fe7f01", //橙色 100 轻度污染
    //      0.299: "#fe7f01", //黄色 100
    //     0.3: "#ff401a", //橙色 150 中度污染
    //       0.399: "#ff401a", //橙色 150
    //     0.4: "#d20040", //红色 200 重度污染
    //     0.599: "#d20040", //红色 200
    //     0.6: "#9c0a4e", //紫色 300 严重污染
    //     0.999: "#9c0a4e",

    //     1.0: "#0D0D0D"

    //     // 0: "#43ce17", //绿色 0优
    //     // // 0.05:"#00deff",
    //     // //  0.089: "#43ce17", //绿色 0优
    //     // 0.1: "#efdc31", //黄色 50良
    //     // //  0.199: "#efdc31", //0
    //     // 0.2: "#fe7f01", //橙色 100 轻度污染
    //     // //  0.299: "#fe7f01", //黄色 100
    //     // 0.3: "#ff401a", //橙色 150 中度污染
    //     // //   0.399: "#ff401a", //橙色 150
    //     // 0.4: "#d20040", //红色 200 重度污染
    //     // // 0.599: "#d20040", //红色 200
    //     // 0.6: "#9c0a4e", //紫色 300 严重污染
    //     // // 0.999: "#9c0a4e",
    //     // 1.0: "#0D0D0D"
    // }; //更高的值颜色不变

    debugger;

    if (param === "AQI") {
      return {
        // 0: "#43ce17", //绿色 0优
        // // 0.05:"#00deff",
        //  0.099: "#43ce17", //绿色 0优
        // 0.1: "#efdc31", //黄色 50良
        //  0.199: "#efdc31", //0
        // 0.2: "#fe7f01", //橙色 100 轻度污染
        //  0.299: "#fe7f01", //黄色 100
        // 0.3: "#ff401a", //橙色 150 中度污染
        //   0.399: "#ff401a", //橙色 150
        // 0.4: "#d20040", //红色 200 重度污染
        // 0.599: "#d20040", //红色 200
        // 0.6: "#9c0a4e", //紫色 300 严重污染
        // 0.999: "#9c0a4e",
        // 1.0: "#0D0D0D"
        0: "#43ce17", //绿色 0优
        // 0.05:"#00deff",
        0.09999: "#43ce17", //绿色 0优
        0.1: "#efdc31", //黄色 50良
        0.199: "#efdc31", //0
        0.2: "#fe7f01", //橙色 100 轻度污染
        0.299: "#fe7f01", //黄色 100
        0.3: "#ff401a", //橙色 150 中度污染
        0.399: "#ff401a", //橙色 150
        0.4: "#d20040", //红色 200 重度污染
        0.599: "#d20040", //红色 200
        0.6: "#9c0a4e", //紫色 300 严重污染
        0.999: "#9c0a4e",

        1.0: "#0D0D0D",
      }; //更高的值颜色不变
    }
    // else if (param === "PM10") {
    else if (param === "a34002") {
      return {
        0: "#43ce17", //绿色 0优
        // 0.05:"#00deff",
        0.08399: "#43ce17", //绿色 0优

        0.084: "#efdc31", //黄色 50良
        0.2499: "#efdc31", //0

        0.25: "#fe7f01", //橙色 100 轻度污染
        0.41699: "#fe7f01", //黄色 100

        0.417: "#ff401a", //橙色 150 中度污染
        0.58299: "#ff401a", //橙色 150

        0.583: "#d20040", //红色 200 重度污染
        0.6999: "#d20040", //红色 200

        0.7: "#9c0a4e", //紫色 300 严重污染
        0.999: "#9c0a4e",

        1.0: "#0D0D0D",
      }; //更高的值颜色不变

      // } else if (param === "PM2_5") {
    } else if (param === "a34004") {
      return {
        // 0: [0, 35, 0.1],
        // 0.1: [35, 75, 0.1],
        // 0.2: [75, 115, 0.1],
        // 0.3: [115, 150, 0.1],
        // 0.4: [150, 250, 0.2],
        // 0.6: [250, 250, null],
        // 0.8: [250, null, null]

        0: "#43ce17", //绿色 0优
        // 0.05:"#00deff",
        0.06999: "#43ce17", //绿色 0优

        0.07: "#efdc31", //黄色 50良
        0.14999: "#efdc31", //0

        0.15: "#fe7f01", //橙色 100 轻度污染
        0.2999: "#fe7f01", //黄色 100

        0.23: "#ff401a", //橙色 150 中度污染
        0.2999: "#ff401a", //橙色 150

        0.3: "#d20040", //红色 200 重度污染
        0.4999: "#d20040", //红色 200

        0.5: "#9c0a4e", //紫色 300 严重污染
        0.999: "#9c0a4e",

        1.0: "#0D0D0D",
      }; //更高的值颜色不变
      // } else if (param === "SO2") {
    } else if (param === "a21026") {
      return {
        // 0: [0, 150, 0.1],
        // 0.1875: [150, 500, 0.1],
        // 0.0625: [500, 650, 0.1],
        // 0.8125: [650, 800, 0.1],
        // 1: [800, null, 0.2],


        0: "#43ce17", //绿色 0优
        // 0.05:"#00deff",
        0.18499: "#43ce17", //绿色 0优

        0.185: "#efdc31", //黄色 50良
        0.62499: "#efdc31", //0

        0.625: "#fe7f01", //橙色 100 轻度污染
        0.2999: "#fe7f01", //黄色 100

        0.8125: "#ff401a", //橙色 150 中度污染
        0.99999: "#ff401a", //橙色 150



        1.0: "#0D0D0D",


      }; //更高的值颜色不变
      // }else if (param === "SO2_D") {
    } else if (param === "SO₂_D") {
      // return {
      //     0: [0, 50, 0.1],
      //     0.019: [50, 150, 0.1],
      //     0.057: [150, 475, 0.1],
      //     0.1813: [475, 800, 0.1],
      //     0.3053: [800, 1600, 0.1],
      //     0.611: [1600, 2100, 0.2],
      //     0.8016: [2100, 2620, 0.2],
      //     1: [2620, null, 0.1],
      // }; //更高的值颜色不变
    }
    // else if (param === "NO2") {
    else if (param === "a21004") {
      return {
        // 0: [0, 100, 0.1],
        // 0.0265: [100, 200, 0.05],
        // 0.052: [200, 700, 0.05],
        // 0.1823: [700, 1200, 0.05],
        // 0.3125: [1200, 2340, 0.05],
        // 0.609: [2340, 3090, 0.2],
        // 0.805: [3090, 3840, 0.2],
        // 1: [3840, null, 0.1],


        0: "#43ce17", //绿色 0优
        // 0.05:"#00deff",
        0.026499: "#43ce17", //绿色 0优

        0.0265: "#efdc31", //黄色 50良
        0.05199: "#efdc31", //0

        0.052: "#fe7f01", //橙色 100 轻度污染
        0.18299: "#fe7f01", //黄色 100

        0.1823: "#ff401a", //橙色 150 中度污染
        0.312499: "#ff401a", //橙色 150

        0.3125: "#d20040", //红色 200 重度污染
        0.608999: "#d20040", //红色 200

        0.609: "#9c0a4e", //紫色 300 严重污染
        0.999: "#9c0a4e",

        1.0: "#0D0D0D",
      }; //更高的值颜色不变
      // } else if (param === "NO2_D") {
    } else if (param === "a21004_D") {
      return {
        // 0: [0, 40, 0.1],
        // 0.0426: [40, 80, 0.1],
        // 0.0851: [80, 180, 0.1],
        // 0.1915: [180, 280, 0.1],
        // 0.2979: [280, 565, 0.1],
        // 0.601: [565, 750, 0.2],
        // 0.8: [750, 940, 0.2],
        // 1: [940, null, 0.1],


        0: "#43ce17", //绿色 0优
        // 0.05:"#00deff",
        0.042599: "#43ce17", //绿色 0优

        0.0426: "#efdc31", //黄色 50良
        0.085099: "#efdc31", //0

        0.0851: "#fe7f01", //橙色 100 轻度污染
        0.191499: "#fe7f01", //黄色 100

        0.1915: "#ff401a", //橙色 150 中度污染
        0.297899: "#ff401a", //橙色 150

        0.2979: "#d20040", //红色 200 重度污染
        0.600999: "#d20040", //红色 200

        0.601: "#9c0a4e", //紫色 300 严重污染
        0.999: "#9c0a4e",

        1.0: "#0D0D0D",
      }; //更高的值颜色不变
    }
    // else if (param === "a21005") {
    else if (param === "a21005") {
      return {
        // 0: [0, 5, 0.1],
        // 0.033: [5, 10, 0.1],
        // 0.067: [10, 35, 0.1],
        // 0.2333: [35, 60, 0.1],
        // 0.4: [60, 90, 0.1],
        // 0.6: [90, 120, 0.2],
        // 0.8: [120, 150, 0.2],
        // 1: [150, null, 0.1],


        0: "#43ce17", //绿色 0优
        // 0.05:"#00deff",
        0.03299: "#43ce17", //绿色 0优

        0.033: "#efdc31", //黄色 50良
        0.06699: "#efdc31", //0

        0.067: "#fe7f01", //橙色 100 轻度污染
        0.233299: "#fe7f01", //黄色 100

        0.2333: "#ff401a", //橙色 150 中度污染
        0.399: "#ff401a", //橙色 150

        0.4: "#d20040", //红色 200 重度污染
        0.5999: "#d20040", //红色 200

        0.6: "#9c0a4e", //紫色 300 严重污染
        0.999: "#9c0a4e",

        1.0: "#0D0D0D"

      }; //更高的值颜色不变
    } else if (param === "a21005_D") {
      return {
        // 0: [0, 2, 0.1],
        // 0.033: [2, 4, 0.1],
        // 0.067: [4, 14, 0.1],
        // 0.233: [14, 24, 0.1],
        // 0.4: [24, 36, 0.1],
        // 0.6: [36, 48, 0.2],
        // 0.8: [48, 60, 0.2],
        // 1: [60, null, 0.1],



        0: "#43ce17", //绿色 0优
        // 0.05:"#00deff",
        0.03299: "#43ce17", //绿色 0优

        0.033: "#efdc31", //黄色 50良
        0.06699: "#efdc31", //0

        0.067: "#fe7f01", //橙色 100 轻度污染
        0.233299: "#fe7f01", //黄色 100

        0.2333: "#ff401a", //橙色 150 中度污染
        0.399: "#ff401a", //橙色 150

        0.4: "#d20040", //红色 200 重度污染
        0.5999: "#d20040", //红色 200

        0.6: "#9c0a4e", //紫色 300 严重污染
        0.999: "#9c0a4e",

        1.0: "#0D0D0D"

      }; //更高的值颜色不变
    }
    // else if (param === "O3") {
    else if (param === "a05024") {
      return {
        // 0: [0, 160, 0.1],
        // 0.133: [160, 200, 0.1],
        // 0.167: [200, 300, 0.1],
        // 0.25: [300, 400, 0.1],
        // 0.33: [400, 800, 0.1],
        // 0.67: [800, 1000, 0.1],
        // 0.833: [1000, 1200, 0.1],
        // 1: [1200, null, 0.1],


        0: "#43ce17", //绿色 0优
        // 0.05:"#00deff",
        0.13299: "#43ce17", //绿色 0优

        0.133: "#efdc31", //黄色 50良
        0.1669: "#efdc31", //0

        0.167: "#fe7f01", //橙色 100 轻度污染
        0.2499: "#fe7f01", //黄色 100


        0.25: "#ff401a", //橙色 150 中度污染
        0.3299: "#ff401a", //橙色 150

        0.33: "#d20040", //红色 200 重度污染
        0.6699: "#d20040", //红色 200


        0.67: "#9c0a4e", //紫色 300 严重污染
        0.999: "#9c0a4e",
        1.0: "#0D0D0D"

      }; //更高的值颜色不变
    }
    // else if (param === "O3_8H") {
    else if (param === "a05024_8H") {
      return {
        // 0: [0, 100, 0.1],
        // 0.125: [100, 160, 0.1],
        // 0.2: [160, 215, 0.1],
        // 0.26875: [215, 265, 0.1],
        // 0.33125: [265, 800, 0.2],
        // 1: [800, null, 0.1],



        0: "#43ce17", //绿色 0优
        // 0.05:"#00deff",
        0.12499: "#43ce17", //绿色 0优

        0.125: "#efdc31", //黄色 50良
        0.1999: "#efdc31", //0

        0.2: "#fe7f01", //橙色 100 轻度污染
        0.268749: "#fe7f01", //黄色 100


        0.26875: "#ff401a", //橙色 150 中度污染
        0.331249: "#ff401a", //橙色 150

        0.33125: "#d20040", //红色 200 重度污染
        0.999: "#d20040", //红色 200

        // 0.67: "#9c0a4e", //紫色 300 严重污染
        // 0.999: "#9c0a4e",
        1.0: "#0D0D0D"
      }; //更高的值颜色不变
    }
  };


  this._getGradientDict = function () {
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
    // return {
    //     0: "#00deff", //蓝色 0
    //     0.1: "#00ff32", //绿色 50
    //     0.2: "#ffdc00", //黄色 100
    //     0.3: "rgb(240,108,25)", //橙色 150
    //     0.4: "rgb(255,0,0)", //红色 200
    //     0.6: "rgb(153,0,76)", //紫色 300
    //     0.8: "rgb(126,0,35)", //褐红 400
    //     1.0: "rgb(111,4,116)"
    // };

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
  this.convertPolygon = function (projection, polygon) {
    // //console.log('convertPolygon');
    let pixPolygon = [];
    for (let i = 0; i < polygon.length; i++) {
      pixPolygon.push(projection([polygon[i][0], polygon[i][1]]));
    }
    return pixPolygon;
  };

  /**
   * 转换多个多边形
   * */
  this.convertPolygons = function (projection, polygons) {
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
  this.drawPolygons = function (canvas, polygons) {
    for (let i = 0; i < polygons.length; i++) {
      this.drawPolygon(canvas, polygons[i]);
    }
  };

  /**
   * 绘制多边形
   * @param canvas
   * @param polygon
   */
  this.drawPolygon = function (canvas, polygon) {
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
  this.pnpoly = function (point, polygon) {
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
