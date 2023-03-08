import turf from "@turf/turf";
import d3 from "d3";

/**
 * 创建canvas
 * @param width
 * @param height
 * @returns {HTMLCanvasElement}
 */
export function createCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function getProjection(center, scale, size) {
  return d3
    .geoMercator()
    .center(center)
    .scale(scale)
    .translate([size[0] / 2, size[1] / 2]);
}

export function getProjectionFitSize(size, features) {
  // features = turf.featureCollection(points);
  // 扩展: fitExtent
  // https://stackoverflow.com/questions/55972289/how-can-i-scale-my-map-to-fit-my-svg-size-with-d3-and-geojson-path-data
  return d3.geoMercator().fitSize([size[0], size[1]], features);
}

export function getProjectionFitSizeBbox(size: [number, number], bbox: [number, number, number, number]) {

  let sw = [bbox[0], bbox[1]];
  let ne = [bbox[2], bbox[3]];
  // features = turf.featureCollection(points);
  // 扩展: fitExtent
  // https://stackoverflow.com/questions/55972289/how-can-i-scale-my-map-to-fit-my-svg-size-with-d3-and-geojson-path-data
  let object: any = {
    type: "FeatureCollection",
    features: [
      {type: "Feature", geometry: {type: "Point", coordinates: [sw[0], sw[1]]}},
      {type: "Feature", geometry: {type: "Point", coordinates: [ne[0], ne[1]]}}]
  };
  return d3.geoMercator().fitSize(
    [size[0], size[1]],
    object
  );
}

class Palette {
  private colors: string [];
  private steps: number;
  private palette: Uint8ClampedArray;

  constructor(colors, steps = 256) {
    this.colors = colors;
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
        levelDict[0.8][0]
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
    palette,
    getColor(val) {
      return palette.getColor(min, max, val);
    },
    getData(val) {
      return palette.getData(min, max, val);
    },
  };
}


export function pointsProjection(points, projection) {
  return points.map((p) => {
    let [x, y] = projection([p.lng, p.lat]);
    return Object.assign(p, {
      x: parseInt(x),
      y: parseInt(y),
    });
  });
}

// 矩阵可视化
export function showMatrixTable(matrix, getColor) {
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
export function showMatrixCanvas(matrix, getData) {
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

export function createMatrix(width, height) {
  let matrix = [];
  for (let i = 0; i <= height; i++) {
    let row = [];
    for (let j = 0; j <= width; j++) {
      row.push(null);
    }
    matrix.push(row);
  }
  return matrix;
}

export function fillMatrix(matrix, pixPoints) {
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

export function insertMatrix(matrix, pixPoints) {
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

export function getRadio(value) {
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


export function fetchJson(url) {
  return fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Network response was not ok.");
  });
}

export async function getBboxByCode(code = "100000") {
  let code_json = await fetchJson("https://geo.datav.aliyun.com/areas_v3/bound/" + code + ".json");
  let code_bbox;
  // console.log(code_json);
  let cn_paths = code_json.features[0].geometry.coordinates.flat(2);
  let cn_line = turf.lineString(cn_paths);
  code_bbox = turf.bbox(cn_line);
  // console.log(code + "_bbox: ", code_bbox);
  return code_bbox;
}

export async function getBoundPathsByCode(code, flatDeep = 1) {
  let code_json = await fetchJson("https://geo.datav.aliyun.com/areas_v3/bound/" + code + ".json");
  let code_paths = code_json.features[0].geometry.coordinates.flat(flatDeep);
  // console.log(code + "_paths: ", code_paths);
  return code_paths;
}

export function bboxToCollection(bbox) {
  let leftBottom = [bbox[0], bbox[1]];
  let rightTop = [bbox[2], bbox[3]];
  let bboxCollection = turf.featureCollection([leftBottom, rightTop].map(turf.point));
  return bboxCollection;
}

// 开尔文转摄氏度 javascript
export function kelvinToCelsius(kelvin) {
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
export function viewOn(view, eventName, layers, callback, outCallback) {

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

export function _getMousePos(evt, view) {
  // container on the view is actually a html element at this point, not a string as the typings suggest.
  let container = view.container;
  let rect = container.getBoundingClientRect();
  return {
    x: evt.x - rect.left,
    y: evt.y - rect.top
  };
}

