// 定义项目和站点的接口
export interface Project {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  district: string;
  adcode: string;
}

export interface Station {
  id: string;
  projectId: string;
  name: string;
  longitude: number;
  latitude: number;
  district: string;
  status: 'normal' | 'error' | 'emergency' | 'inspection';
}

import { StationMarker } from './StationMarker';
import { ProjectMarker } from './ProjectMarker';

export class MapManager {
  private map: any;
  private projectMarkers: ProjectMarker[] = [];
  private stationMarkers: StationMarker[] = [];
  private nationalBoundary: any[] = []; // 存储全国边界
  private districtPolygon: any[] = []; // 存储省级边界
  private maskPolygon: any = null; // 存储遮罩
  public onProjectClick: ((project: Project) => void) | null = null;
  public onStationClick: ((station: Station) => void) | null = null;

  constructor() {}

  async initMap(container: string) {
    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;
    const AMap = await AMapLoader.load({
      key: '89993716c6fd5807f7e5bdcef614a28f',
      version: '2.0',
      plugins: ['AMap.DistrictSearch', 'AMap.DistrictLayer'],
    });

    this.map = new AMap.Map(container, {
      zoom: 5,
      center: [103.5, 36.5], // 调整到甘肃中部，这个位置能更好地展示整个中国
      mapStyle: 'amap://styles/darkblue',
    });

    // 显示全国边界
    await this.showNationalBoundary();
  }

  // 显示全国边界
  private async showNationalBoundary() {
    const boundaryData = await this.fetchBoundaryData('100000');
    if (!boundaryData || !boundaryData.features?.length) {
      console.error('未找到全国边界数据');
      return;
    }

    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;
    const AMap = await AMapLoader.load({
      key: '89993716c6fd5807f7e5bdcef614a28f',
      version: '2.0',
    });

    // 清除之前的全国边界
    this.clearNationalBoundary();

    // 获取边界坐标
    const feature = boundaryData.features[0];
    const coordinates = feature.geometry.coordinates;

    // 创建多边形
    coordinates.forEach((ring: number[][][]) => {
      const path = ring[0].map((coord: number[]) => {
        return new AMap.LngLat(coord[0], coord[1]);
      });

      const polygon = new AMap.Polygon({
        path: path,
        strokeColor: '#3366FF',
        strokeWeight: 2,
        fillColor: '#3366FF',
        fillOpacity: 0.05,
        zIndex: 10, // 设置较低的 zIndex，确保在省级边界下方
      });

      this.nationalBoundary.push(polygon);
      this.map.add(polygon);
    });
  }

  // 清除全国边界
  private clearNationalBoundary() {
    this.nationalBoundary.forEach(polygon => {
      this.map.remove(polygon);
    });
    this.nationalBoundary = [];
  }

  // 显示项目点位
  async showProjects(projects: Project[]) {
    this.clearStations();
    this.clearDistrict();
    
    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;
    const AMap = await AMapLoader.load({
      key: '89993716c6fd5807f7e5bdcef614a28f',
      version: '2.0',
    });
    
    projects.forEach((project) => {
      const projectMarker = new ProjectMarker(
        this.map,
        AMap,
        project,
        this.onProjectClick || undefined
      );
      this.projectMarkers.push(projectMarker);
    });
  }

  // 显示站点点位
  async showStations(stations: Station[]) {
    this.clearProjects();
    
    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;
    const AMap = await AMapLoader.load({
      key: '89993716c6fd5807f7e5bdcef614a28f',
      version: '2.0',
    });
    
    stations.forEach((station) => {
      const stationMarker = new StationMarker(
        this.map,
        AMap,
        station,
        this.onStationClick || undefined
      );
      this.stationMarkers.push(stationMarker);
    });
  }

  // 获取城市边界数据
  private async fetchBoundaryData(adcode: string): Promise<any> {
    try {
      const response = await fetch(`https://geo.datav.aliyun.com/areas_v3/bound/${adcode}.json`);
      return await response.json();
    } catch (error) {
      console.error('获取边界数据失败:', error);
      return null;
    }
  }

  // 高亮显示行政区
  async showDistrict(adcode: string, style?: {
    strokeColor: string;
    strokeWeight: number;
    fillColor: string;
    fillOpacity: number;
  }) {
    if (adcode === '100000') {
      // 如果是显示全国边界，直接返回
      return;
    }

    const boundaryData = await this.fetchBoundaryData(adcode);
    if (!boundaryData || !boundaryData.features?.length) {
      console.error('未找到边界数据');
      return;
    }

    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;
    const AMap = await AMapLoader.load({
      key: '89993716c6fd5807f7e5bdcef614a28f',
      version: '2.0',
    });

    // 清除之前的省级边界
    this.clearDistrict();

    // 获取边界坐标
    const feature = boundaryData.features[0];
    const coordinates = feature.geometry.coordinates;

    // 创建多边形
    coordinates.forEach((ring: number[][][]) => {
      const path = ring[0].map((coord: number[]) => {
        return new AMap.LngLat(coord[0], coord[1]);
      });

      const polygon = new AMap.Polygon({
        path: path,
        strokeColor: style?.strokeColor || '#3366FF',
        strokeWeight: style?.strokeWeight || 2,
        fillColor: style?.fillColor || '#3366FF',
        fillOpacity: style?.fillOpacity || 0.2,
        zIndex: 11, // 设置较高的 zIndex，确保在全国边界上方
      });

      this.districtPolygon.push(polygon);
      this.map.add(polygon);
    });

    // 添加遮罩
    await this.addMask(coordinates[0][0]);

    // 调整视图以适应边界
    this.map.setFitView(this.districtPolygon, false, [50, 50, 50, 50]);
  }

  // 添加遮罩
  private async addMask(pathPoints: number[][]) {
    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;
    const AMap = await AMapLoader.load({
      key: '89993716c6fd5807f7e5bdcef614a28f',
      version: '2.0',
    });

    // 清除之前的遮罩
    this.clearMask();

    // 创建遮罩路径（一个大矩形，中间挖空行政区形状）
    const bounds = new AMap.Bounds([-180, -90], [180, 90]);
    const path = [
      bounds.getSouthWest(),
      bounds.getSouthEast(),
      bounds.getNorthEast(),
      bounds.getNorthWest()
    ];

    // 添加行政区路径（内环）
    const holes = [pathPoints.map(point => new AMap.LngLat(point[0], point[1]))];

    // 创建遮罩多边形
    this.maskPolygon = new AMap.Polygon({
      path: [path, ...holes],
      strokeWeight: 0,
      fillColor: '#000',
      fillOpacity: 0.7,
      zIndex: 10,
    });

    this.map.add(this.maskPolygon);
  }

  // 清除遮罩
  private clearMask() {
    if (this.maskPolygon) {
      this.map.remove(this.maskPolygon);
      this.maskPolygon = null;
    }
  }

  // 清除省级边界
  clearDistrict() {
    this.districtPolygon.forEach(polygon => {
      this.map.remove(polygon);
    });
    this.districtPolygon = [];
    this.clearMask(); // 同时清除遮罩
  }

  // 清除项目点位
  clearProjects() {
    this.projectMarkers.forEach((marker) => {
      marker.remove();
    });
    this.projectMarkers = [];
  }

  // 清除站点点位
  clearStations() {
    this.stationMarkers.forEach((marker) => {
      marker.remove();
    });
    this.stationMarkers = [];
  }

  // 根据状态筛选站点
  filterStationsByStatus(stations: Station[], status: string) {
    this.clearStations();
    const filteredStations = stations.filter((station) => status === '' || station.status === status);
    this.showStations(filteredStations);
  }

  // 设置地图视图
  async setMapView(center: [number, number], zoom: number, immediate: boolean = false) {
    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;
    const AMap = await AMapLoader.load({
      key: '89993716c6fd5807f7e5bdcef614a28f',
      version: '2.0',
    });

    this.map.setZoomAndCenter(zoom, center, immediate);
  }

  // 重置到全国视图
  async resetToNationalView() {
    // 清除省级边界
    this.clearDistrict();
    
    // 确保全国边界显示
    await this.showNationalBoundary();

    // 平滑过渡到全国视图
    await this.setMapView([103.5, 36.5], 5, false);
  }
}
