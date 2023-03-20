<template>
  <div class="cesium-map">
    <div :id="mapID"></div>

  </div>
</template>

<script lang="ts" setup>

import {onMounted, onUnmounted, PropType} from "vue";

import {createMap, destroyMap, loadGaoDeImageryLayers} from "./cesiumUtil";
import {MapID} from "@/components/cesiumMap/model";
import type {Viewer} from "cesium";

const props = defineProps({
  mapID: {
    type: String as PropType<MapID>,
    required: true,
  }
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
    maximumRenderTimeChange: Infinity
  });
  // 隐藏下方Cesium logo
  let creditContainer = cesiumView.cesiumWidget.creditContainer as HTMLDivElement;
  creditContainer.style.display = "none";

  // 加载影像图层
  loadGaoDeImageryLayers(cesiumView, 0);
});

onUnmounted(() => {
  destroyMap(props.mapID);
});

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
