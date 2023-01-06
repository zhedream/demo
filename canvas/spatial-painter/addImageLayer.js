function logPix_toMap(view, x, y) {
  let rightBottomPix = view.toMap({x: x, y: y});
  console.log(`view.toMap({ x: ${x}, y: ${y} }): `, [rightBottomPix.longitude, rightBottomPix.latitude]);
}

/**
 * 图层构造函数: 叠加图片
 * @returns {Promise<any[]>}
 */
function getCustomImageOverlayLayer() {
  return loadModules([
    "esri/layers/BaseDynamicLayer",
    "esri/geometry/support/webMercatorUtils"
  ]).then(
    ([BaseDynamicLayer, webMercatorUtils]) => {
      let getImageUrl = async function(extent, width, height) {
        console.log("extent: ", extent);

        // console.log("width: ", width);
        // console.log("height: ", height);
        const view = this.view;

        logPix_toMap(view, 0, 0);
        // logPix_toMap(view, width, 0);


        //新Image对象，可以理解为DOM
        if (!this.image) {
          this.image = new Image();
        }
        console.log("getImageUrl");
        if (!this.image.src) {
          this.image.src = this.picUrl;
          await new Promise((res) => {
            this.image.onload = () => {
              console.log("image loaded");
              res();
            };
          });
        }

        // 创建canvas DOM元素，并设置其宽高和图片一样
        if (!this.canvas) {
          this.canvas = document.createElement("canvas");
        }
        this.canvas.width = width;
        this.canvas.height = height;

        //左上角坐标转换屏幕坐标,为了获取 canvas 绘制图片的起点
        let mapPoint = {
          x: this.extent.xmin,
          y: this.extent.ymax,
          spatialReference: {
            wkid: 4326,
          },
        };
        // 图片左上角对应,地图画布的xy => 空间点 转换为 屏幕点/画布点
        let imageLeftTop_mapPix = view.toScreen(mapPoint);
        console.log("leftTop_Screen: ", imageLeftTop_mapPix);
        //根据extent范围计算canvas绘制图片的宽度以及高度
        //左下角
        let leftBottom = {
          x: this.extent.xmin,
          y: this.extent.ymin,
          spatialReference: {
            wkid: 4326,
          },
        };
        let imageLeftBottom_mapPix = view.toScreen(leftBottom);
        console.log("leftBottom_Screen: ", imageLeftBottom_mapPix);
        //右上角
        let rightTop = {
          x: this.extent.xmax,
          y: this.extent.ymax,
          spatialReference: {
            wkid: 4326,
          },
        };
        let imageRightTop_mapPix = view.toScreen(rightTop);
        console.log("rightTop_Screen: ", imageRightTop_mapPix);

        this.canvas
          .getContext("2d")
          .drawImage(
            this.image,
            imageLeftTop_mapPix.x,
            imageLeftTop_mapPix.y,
            Math.abs(imageRightTop_mapPix.x - imageLeftBottom_mapPix.x),
            Math.abs(imageRightTop_mapPix.y - imageLeftBottom_mapPix.y)
            // 9999,
            // 9999
          );
        console.log("输出 canvas");
        document.body.appendChild(this.canvas);

        return this.canvas.toDataURL("image/png");
      };
      return BaseDynamicLayer.createSubclass({
        properties: {
          picUrl: null,
          extent: null,
          image: null,
          canvas: null,
          view: null,
        },

        // Override the getImageUrl() method to generate URL
        // to an image for a given extent, width, and height.
        getImageUrl: getImageUrl,
      });
    }
  );
}

function addImageLayer(view, map, imageLayerID, sw, ne, canvas, option = {}) {
  const {opacity = 1} = option;
  return getCustomImageOverlayLayer().then((CustomImageOverlayLayer) => {
    const view1 = view;
    const map1 = map;
    const layerId = imageLayerID;

    // 单例图层
    const layer = map1.findLayerById(layerId);
    if (layer) map1.remove(layer);

    var ImageOverlayLayer = new CustomImageOverlayLayer({
      id: layerId,
      // picUrl: "0.png",
      extent: {
        xmin: sw[0],
        ymin: sw[1],
        xmax: ne[0],
        ymax: ne[1],
      },
      picUrl: canvas.toDataURL(),
      // picUrl:
      //   "http://127.0.0.1:5500/canvas/spatial-painter/Snipaste_2022-08-16_15-09-39.png",
      // extent: extent,
      view: view1,
      opacity,
    });

    // ImageOverlayLayer.when(function () {
    //   view1.extent = ImageOverlayLayer.extent;
    // });

    map1.add(ImageOverlayLayer);
  });
}
