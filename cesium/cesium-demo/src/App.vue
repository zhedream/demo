<template>
  <div id="app">
    <div>
      <button @click="createTask">createTask</button>
      &nbsp;
      <button @click="show1()">show</button>
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
import {getViewer, Point} from "@/components/cesiumMap/cesiumUtil";
import graphicsData from "@/components/cesiumMap/data2.json";
import * as Cesium from "cesium";
import {MapID} from "@/components/cesiumMap/model";
import {onMounted} from "vue";
import {GenTask, IRunTaskReturn, runNext} from "@/components/cesiumMap/lidarUtil";


import Tem from "@/tem.vue";
import {renderHTML} from "@/renderHTML";


onMounted(() => {
  renderHTML(Tem, {msg: "hello"})
      .then(res=>{

        window.rrr = res

      });
});


// let a = new Tem({msg: "123"});


// =============  添加图片

let cesiumView: Cesium.Viewer;
onMounted(() => {
  let viewer = getViewer(MapID.contaninerID);
  if (!viewer) return;
  cesiumView = viewer;
  // console.log(viewer);
});

let paths: [Point, Point][] = [];

graphicsData.forEach((graphic,) => {
  let path: any = graphic.geometry.paths[0];
  paths.push(path);
});
// console.log(paths);

let walls = paths.map((item) => {
  return {
    url: "",
    points: item
  };
});

let task: IRunTaskReturn;
let taskDone: boolean;

async function createTask() {
  task = GenTask(walls, cesiumView);
  taskDone = false;
}

async function render(task: IRunTaskReturn, count = 1) {
  if (!taskDone) {
    let last = await runNext(task, count);

    var cameraPosition = cesiumView.camera.position;
    var cartographicPosition = Cesium.Cartographic.fromCartesian(cameraPosition);
    var longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);
    var latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);
    var height = cartographicPosition.height;

    let destination = Cesium.Cartesian3.fromDegrees(longitude, latitude, height - 1);
    cesiumView.zoomTo(cesiumView.entities).then();

    // cesiumView.camera.flyTo({
    //   destination: destination,
    //   // orientation: {
    //   //   heading: Cesium.Math.toRadians(0),
    //   // }
    // });
    if (last.done) {
      taskDone = true;
    }
  }
}

function clear() {
  task.return();
  taskDone = false;
  cesiumView.entities.removeAll();
}

function show1(count = 100) {
  if (taskDone) return ;
  let res: any;
  let P = new Promise((resolve, reject) => {
    res = resolve;
  });
  requestIdleCallback(() => {
    render(task, 20).then(() => {
      setTimeout(() => {
        res();
      }, 2000);
    });
  }, {timeout: 1000});
  P.then(() => {
    if (count === 100) {
      cesiumView.zoomTo(cesiumView.entities).then();
    }
    console.log("绘制完成 10个图片");
    show1(count - 1);
  });
}

function test() {
  window.cesiumView = cesiumView;
  let entities = cesiumView.entities.values;
  // for (let entity of entities) {
  //   // 在这里对每个实体对象进行操作
  //   // cesiumView.entities.remove(entity);
  // }

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
