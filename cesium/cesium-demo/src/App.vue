<template>
  <div id="app">
    <div>
      <button @click="render()">show</button>
      &nbsp;
      <button @click="clear">clear</button>
      &nbsp;
      <button @click="test">test</button>
    </div>
    <CesiumMap :mapID="MapID.contaninerID"></CesiumMap>
  </div>
</template>

<script lang="ts" setup>
import CesiumMap from "@/components/cesiumMap/index.vue";
import { getViewer, Point } from "@/components/cesiumMap/cesiumUtil";
import graphicsData from "@/components/cesiumMap/data2.json";
import * as Cesium from "cesium";
import { MapID } from "@/components/cesiumMap/model";
import { onMounted } from "vue";
import { GenTask, sleep } from "@/components/cesiumMap/lidarUtil";

// =============  添加图片

let cesiumView: Cesium.Viewer;
onMounted(() => {
  let viewer = getViewer(MapID.contaninerID);
  if (!viewer) return;
  cesiumView = viewer;
  // console.log(viewer);
});

let paths: [Point, Point][] = [];

graphicsData.forEach((graphic) => {
  let path: any = graphic.geometry.paths[0];
  paths.push(path);
});


let walls = paths.map((item) => {
  return {
    url: "",
    points: item,
  };
});

let signalController: AbortController;

async function render() {
  signalController = new AbortController();
  let signal = signalController.signal;

  let g = GenTask(walls, cesiumView);

  let index = 0;

  for await (let item of g) {
    if (signal.aborted) {
      g.return();
      break;
    }
    console.log(item);

    await sleep(100);

    if (index++ === 10) {
      cesiumView.zoomTo(cesiumView.entities).then();
    }
  }
}

function clear() {
  signalController.abort();
  cesiumView.entities.removeAll();
}

function test() {
  //@ts-ignore
  window.cesiumView = cesiumView;
  let entities = cesiumView.entities.values;
  console.log("entities: ", entities);

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
