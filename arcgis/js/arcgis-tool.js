async function initMap() {
  let [Map, MapView, WebTileLayer] = await loadModules([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/WebTileLayer",
  ]);
  map = new Map({
    // basemap: "satellite",
  });
  view = new MapView({
    container: "map-view",
    map: map,
    // center: [106.89374561958043, 37.73011692624135],
    center: [106.89374561958043, 37.73011692624135],
    zoom: 4,
    constraints: {
      // rotationEnabled: false,
      // minZoom: 12,
      // maxZoom: 3,
    },
  });

  let tileLayer = new WebTileLayer({
    id: "tileLayer",
    title: "tileLayer",
    subDomains: ["webrd01"],
    urlTemplate:
      "http://{subDomain}.is.autonavi.com/appmaptile?x={col}&y={row}&z={level}&lang=zh_cn&size=1&scale=1&style=8",
  });
  map.add(tileLayer);
  map.reorder(tileLayer, 0);
}

function loadModules(params) {
  return new Promise((res) => {
    require(params, function () {
      res(arguments);
    });
  });
}

/**
 * 函数劫持 后置钩子
 * @param fn 被劫持的函数
 * @param hook 劫持函数
 * @param hookReturn 是否劫持返回值
 * @returns {function(): *}
 */
function hookFunction(fn, hook, hookReturn = false) {
  return function () {
    const args = Array.prototype.slice.call(arguments);
    const result = fn.apply(this, args);
    const hookResult = hook(result, args);
    return hookReturn ? hookResult : result;
  };
}

async function layerAdd(layer, graphicPromise) {
  layer.add(await graphicPromise);
}

/**
 * 获取 图片 点位 Graphic
 * @param canvas canvas 图片
 * @param center 经纬度
 * @param symbolData 符号渲染配置
 * @returns {{symbol: *, popupTemplate: *, geometry: *, attributes: *}}
 */
function getCanvasPointGraphic(canvas, center, symbolData = {}) {
  // let [Graphic] = await loadModules(["esri/Graphic"]);
  const point = {
    //Create a point
    type: "point",
    longitude: center[0],
    latitude: center[1],
  };

  // 定义 缩小倍数
  const symbolScale = symbolData.scale || 1;
  const pictureMarkerSymbol = {
    type: "picture-marker",
    url: canvas.toDataURL(), // require("@/assets/image/point-city.png"),
    width: canvas.width * symbolScale,
    height: canvas.height * symbolScale,
    // xoffset: 0,
    // yoffset: -12,
  };

  const symbolOption = symbolData.option || {};
  Object.assign(pictureMarkerSymbol, symbolOption);

  return {
    geometry: point,
    symbol: pictureMarkerSymbol,
    attributes: {},
    popupTemplate: {
      title: "自定义内容: 异步 Dom {point}",
      content: async function (e) {
        console.log("e: ", e);

        const content = document.createElement("div");

        content.style.width = "200px";
        content.style.height = "200px";
        content.style.backgroundColor = "red";
        content.innerHTML = "point";
        document.body.style.cursor = "progress";
        await sleep(1000);
        document.body.style.cursor = "auto";
        return content;
      },
    },
  };
}
function sleep(time = 100) {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, time);
  });
}

/**
 * 监听事件并匹配结果
 * @param view
 * @param eventName
 * @param layers
 * @param callback
 * @param outCallback
 * @returns {*} 移除监听事件的函数对象 object.remove()
 */
function viewOnHitTest(view, eventName, layers, callback, outCallback) {
  if (!(layers instanceof Array)) {
    layers = [layers];
  }
  return view.on(eventName, (e) => {
    viewLayersHitTest(view, e, layers).then((results) => {
      if (results.length > 0) {
        callback && callback(results, e);
      } else {
        outCallback && outCallback();
      }
    });
  });
}

function viewOnHitTestOnce(view, eventName, layers, callback, outCallback) {
  if (callback) callback = hookFunction(callback, () => o && o.remove());
  if (outCallback)
    outCallback = hookFunction(outCallback, () => o && o.remove());
  let o = viewOnHitTest(view, eventName, layers, callback, outCallback);
}

function viewLayersHitTest(view, e, layers = []) {
  return new Promise((res) => {
    view.hitTest(e).then(function (response) {
      // console.log("response: ", response);
      // let { screenPoint, results } = response;
      if (layers.length === 0) {
        return res(response.results);
      }
      let results = response.results.filter((result) => {
        let resultLayer;
        if (result.graphic) {
          resultLayer = result.graphic.layer;
        }
        return layers.some((layer) => layer === resultLayer);
      });
      res(results);
    });
  });
}

/**
 *
 * @param {*} view
 * @param {*} layerType  ['web-tile', 'graphics']
 * @returns
 */
function getViewLayersByType(view, layerType) {
  return view.map.layers.items.filter((layer) => layer.type === layerType);
}

// view.map.layers.items.map(v=>v.type)

/**
 * 自动缩放至图层范围
 * @param view
 * @param layer
 */
function viewGotoLayerExtent(view, layer) {
  // 自动缩放至
  layer.when(function () {
    console.log("layer: ", layer);
    layer.queryExtent().then(function (results) {
      // go to the extent of the results satisfying the query

      console.log("results.extent: ", results.extent);

      let { xmax, xmin, ymax, ymin } = results.extent;
      let xDiff = xmax - xmin;
      let yDiff = ymax - ymin;

      let min = Math.min(xDiff, yDiff);
      let max = Math.max(xDiff, yDiff);

      console.log("max: ", max);
      console.log("min: ", min);
      if (max < 0.006) {
        console.log("max1: ");
        view.goTo({
          center: results.extent.center,
          zoom: 16,
        });
      } else if (max > 100) {
        console.log("max2: ");
        view.goTo({
          center: results.extent.center,
          zoom: 3,
        });
      } else {
        console.log("max3: ");
        // view.goTo(results.extent);
        view.goTo(results.extent.expand(1.5));
      }
    });
  });
}
