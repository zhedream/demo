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

async function layerAdd(layer, graphicPromise) {
  layer.add(await graphicPromise);
}

async function getCanvasGraphicPoint(canvas, center, symbolData = {}) {
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
    attributes: {
      name: "point",
      age: 12,
    },
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

function viewLayersOn(view, eventName, layers, callback, outCallback) {
  if (!(layers instanceof Array)) {
    layers = [layers];
  }
  return view.on(eventName, (e) => {
    view.hitTest(e).then(function (response) {
      let results = response.results;
      let graphics = results.filter(function (result) {
        console.log("result: ", result);
        // check if the graphic belongs to the layer of interest
        return layers.some((layer) => layer === result.graphic.layer);
      });
      if (graphics.length > 0) {
        callback && callback(graphics, e);
      } else {
        outCallback && outCallback();
      }
    });
  });
}

function viewLayersOnOnce(view, eventName, layers, callback, outCallback) {
  if (!(layers instanceof Array)) {
    layers = [layers];
  }
  let o = view.on(eventName, (e) => {
    view.hitTest(e).then(function (response) {
      let results = response.results;
      let graphics = results.filter(function (result) {
        console.log("result: ", result);
        // check if the graphic belongs to the layer of interest
        return layers.some((layer) => layer === result.graphic.layer);
      });
      if (graphics.length > 0) {
        callback && callback(graphics, e);
      } else {
        outCallback && outCallback();
      }
    });
    o.remove();
  });
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
