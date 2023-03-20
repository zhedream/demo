import * as Cesium from "cesium";
import {Entity, Viewer} from "cesium";
import {addWallImage, Point} from "@/components/cesiumMap/cesiumUtil";


export function getPathLength(path: Cesium.Cartesian3[]) {
  let length = 0;
  for (let i = 0; i < path.length - 1; i++) {
    length += Cesium.Cartesian3.distance(path[i], path[i + 1]);
  }
  return length;
}


class imageRender {
  protected taskDone: boolean = false;

  protected cache: wallImageInfo[] = [];

  constructor() {
  }

  addCache(walls: wallImageInfo[]) {
    this.cache = this.cache.concat(walls);
  }

  renderCache() {

  }

}

interface wallImageInfo {
  // image: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
  url: string,
  points: [Point, Point];
}


export type IRunTaskReturn = AsyncGenerator<Entity, void, undefined>;

export type IReturn = IteratorResult<Entity, void>;

export async function* GenTask(walls: wallImageInfo[], cesiumView: Viewer): IRunTaskReturn {
  for (let i = 0; i < walls.length; i++) {
    if (i > 1000) break;
    let image = await fetchImage("/demo.png?index=" + i);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 50);
    });
    const wall = walls[i];
    yield addWallImage({
      id: "lidar-" + i,
      points: wall.points,
      image: image,
      viewer: cesiumView,
    });
  }
  return;
}


export async function fetchImage(url: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.src = url;
  });
}


export async function runNext<T, TReturn>(task: AsyncGenerator<T, TReturn>, maxCount = 1) {
  console.log("runNext");
  let last = await task.next();
  while (!last.done && --maxCount > 0) {
    console.log("while");
    last = await task.next();
  }
  console.log("runNext:end");
  return last;
}

