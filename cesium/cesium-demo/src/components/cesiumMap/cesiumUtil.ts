import { MapID } from "@/components/cesiumMap/model";
import * as Cesium from "cesium";
import { Cartesian3, Entity, Viewer } from "cesium";

const viewList = new Map<MapID, Viewer>();

export function createMap(
  mapID: MapID,
  options: Viewer.ConstructorOptions = {}
) {
  const viewer = new Viewer(mapID, options);
  viewList.set(mapID, viewer);
  return viewer;
}

export function destroyMap(mapID: MapID) {
  const viewer = viewList.get(mapID);
  if (viewer) {
    viewer.destroy();
    viewList.delete(mapID);
  }
}

export function getViewer(mapID: MapID) {
  return viewList.get(mapID);
}

type ImageType = 0 | 1 | 2;

export function loadGaoDeImageryLayers(viewer: Viewer, type: ImageType) {
  viewer.imageryLayers.length && viewer.imageryLayers.removeAll();

  if (type == 0) {
    //高德矢量图
    let tdtLayer = new Cesium.UrlTemplateImageryProvider({
      url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
      minimumLevel: 3,
      maximumLevel: 18,
    });
    viewer.imageryLayers.addImageryProvider(tdtLayer);
  } else if (type == 1) {
    //高德影像
    let tdtLayer = new Cesium.UrlTemplateImageryProvider({
      url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
      minimumLevel: 3,
      maximumLevel: 18,
    });
    viewer.imageryLayers.addImageryProvider(tdtLayer);
  } else if (type == 2) {
    //高德路网中文注记
    let tdtLayer = new Cesium.UrlTemplateImageryProvider({
      url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
      minimumLevel: 3,
      maximumLevel: 18,
    });
    viewer.imageryLayers.addImageryProvider(tdtLayer);
  }
}

export function addPointImage(
  viewer: Viewer,
  url: string,
  position: Cesium.Cartesian3,
  width: number,
  height: number
) {
  return viewer.entities.add({
    position: position,
    billboard: {
      image: url,
      width: width,
      height: height,
    },
  });
}

interface option {
  id?: string;
  group?: string;
  viewer: Viewer;
  image: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;
  points: Points3;
}

export type Point = [number, number];

export type Points2 = [Point, Point];

export type Points3 = [Point, Point, ...Point[]];

export type Path = Point[];

/**
 * 添加墙体
 */
export function addWallImage({ viewer, id, group, image, points }: option) {
  console.log(id);

  let imageMaterial = new Cesium.ImageMaterialProperty({
    image: image,
    transparent: true,
    // repeat: new Cesium.Cartesian2(1, 1)
  });

  let arr = [];
  points.forEach((item) => {
    arr.push(...item, 0);
  });

  // let arr = [
  //   points[0][0],points[0][1],0,
  //   points[1][0],points[1][1],0,
  //   points[2][0],points[2][1],0,
  // ];

  let positions = Cartesian3.fromDegreesArrayHeights(arr);

  let entity = new Entity({
    id: id,
    // @ts-ignore
    properties: {
      group,
      points,
    },
    wall: {
      positions: positions,
      material: imageMaterial,
      minimumHeights: positions.map(() => 5000),
    },
  });

  return viewer.entities.add(entity);
}

export function removeWallImageByIds(viewer: Viewer, ids: string | string[]) {
  if (typeof ids == "string") {
    ids = [ids];
  }
  let entities = viewer.entities.values;
  for (let i = 0; i < entities.length; i++) {
    let entity = entities[i];
    if (ids.includes(entity.id)) {
      viewer.entities.remove(entity);
    }
  }
}

export function removeWallImageByGroup(viewer: Viewer, group: string) {
  let entities = viewer.entities.values;
  for (let i = 0; i < entities.length; i++) {
    let entity = entities[i];
    if (
      entity.properties &&
      entity.properties.group &&
      entity.properties.group.getValue() == group
    ) {
      viewer.entities.remove(entity);
      i--;
    }
  }
}

/**
 * 将点数组转换 线段数组
 * @description 每两个点组成一条线段
 * @param points
 * @returns {Points2[]}
 */
export function composePoints(points: Point[]): Points2[] {
  let paths: Points2[] = [];
  for (let i = 1; i < points.length; i++) {
    let prePoint = points[i - 1];
    let point = points[i];
    let path: Points2 = [prePoint, point];
    paths.push(path);
  }
  return paths;
}
