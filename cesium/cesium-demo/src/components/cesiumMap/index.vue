<template>
  <div class="cesium-map">
    <div :id="mapID"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, PropType } from "vue";

import { createMap, destroyMap, loadGaoDeImageryLayers } from "./cesiumUtil";
import { MapID } from "@/components/cesiumMap/model";
import type { Viewer } from "cesium";
import * as Cesium from "cesium";

const props = defineProps({
  mapID: {
    type: String as PropType<MapID>,
    required: true,
  },
});

let cesiumView: Viewer = null as any;

onMounted(() => {
  cesiumView = createMap(props.mapID, {
    animation: false, // 隐藏动画控件
    baseLayerPicker: false, // 隐藏图层选择控件
    fullscreenButton: false, // 隐藏全屏按钮
    vrButton: false, // 隐藏VR按钮，默认false
    geocoder: false, // 隐藏地名查找控件
    homeButton: false, // 隐藏Home按钮
    infoBox: false, // 隐藏点击要素之后显示的信息窗口
    sceneModePicker: false, // 隐藏场景模式选择控件
    selectionIndicator: true, // 显示实体对象选择框，默认true
    timeline: false, // 隐藏时间线控件
    navigationHelpButton: false, // 隐藏帮助按钮
    scene3DOnly: true, // 每个几何实例将只在3D中呈现，以节省GPU内存
    shouldAnimate: true, // 开启动画自动播放
    sceneMode: 3, // 初始场景模式 1：2D 2：2D循环 3：3D，默认3
    requestRenderMode: true, // 减少Cesium渲染新帧总时间并减少Cesium在应用程序中总体CPU使用率
    // 如场景中的元素没有随仿真时间变化，请考虑将设置maximumRenderTimeChange为较高的值，例如Infinity
    maximumRenderTimeChange: Infinity,
  });
  // 隐藏下方Cesium logo
  let creditContainer = cesiumView.cesiumWidget
    .creditContainer as HTMLDivElement;
  creditContainer.style.display = "none";

  // 加载影像图层
  loadGaoDeImageryLayers(cesiumView, 0);

  // 添加文本表情啊
  cesiumView.scene.primitives.add(label);

  // 处理点位点击事件
  handlePointClick();
});

onUnmounted(() => {
  destroyMap(props.mapID);
  removePointClick();
});

let leftClickGetLngAndLatHandler;

var label = new Cesium.LabelCollection(); // 全局变量，用于存储当前展示的提示框

function handlePointClick() {
  if (leftClickGetLngAndLatHandler) {
    console.log("leftClickGetLngAndLatHandler 已存在");
    return;
  }
  leftClickGetLngAndLatHandler = new Cesium.ScreenSpaceEventHandler(
    cesiumView.scene.canvas
  );
  leftClickGetLngAndLatHandler.setInputAction(function (click) {
    let pickedObject = cesiumView.scene.pick(click.position);

    if (Cesium.defined(pickedObject)) {
      let ellipsoid = cesiumView.scene.globe.ellipsoid;
      // 获取鼠标点击位置所在的世界坐标系位置
      var position = cesiumView.scene.pickPosition(click.position);
      let cartographic = ellipsoid.cartesianToCartographic(position);
      console.log(cartographic);
      var height = cartographic.height;
      console.log("鼠标点击位置的高度为：" + height + "米");


      // 将经纬度和高度信息转换成字符串
      var lonStr = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
      var latStr = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
      var heightStr = height.toFixed(2);

      // 创建提示框的位置和文本内容
      var labelPosition = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        height
      );
      var labelText =
        "经度：" + lonStr + "\n纬度：" + latStr + "\n高度：" + heightStr;
      // labelText = `
      // 时间: ${lidarData.time}
      // 经度：${lonStr} 纬度：${latStr}
      // 高度：${heightStr}
      // 值：${lidar.getValue(nextHeightIndex)}
      // 高度索引：${nextHeightIndex}
      // `;

      // 创建新的 Primitive 并添加到场景中
      label.removeAll();
      label.add({
        position: labelPosition,
        text: labelText,
        font: "14px sans-serif",
        showBackground: true,
        backgroundColor: Cesium.Color.WHITE, // new Cesium.Color(0.1, 0.1, 0.1, 0.7),
        fillColor: Cesium.Color.BLACK,
        backgroundPadding: new Cesium.Cartesian2(5, 5),
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        // pixelOffset: new Cesium.Cartesian2(0, 0),
        heightReference: Cesium.HeightReference.NONE, // 设置提示框的高度参考系统为悬浮在场景中，不随地形变化而改变高度
        disableDepthTestDistance: Number.POSITIVE_INFINITY, // 禁用深度测试距离，默认情况下视为无穷大
        // nearFarScalar: new Cesium.NearFarScalar(10000, 1.0, Number.POSITIVE_INFINITY, 0.2), // 在距离大于 1000 米时显示完整大小（缩放因子为 1.0），在距离大于 5000000 米时显示透明度为 0.2 的提示框
      });

    } else {
      label.removeAll();
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function removePointClick() {
  if (leftClickGetLngAndLatHandler) {
    leftClickGetLngAndLatHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
    leftClickGetLngAndLatHandler = null;
  }
}
</script>

<style lang="less" scoped>
.cesium-map {
  width: 100%;
  height: 100%;
  position: relative;

  .cesium-viewer {
    width: 100%;
    height: 100%;
  }
}
</style>
