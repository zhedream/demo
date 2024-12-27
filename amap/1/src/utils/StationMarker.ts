import type { Station } from './MapManager';
import { StationInfoWindow } from './StationInfoWindow';

export class StationMarker {
  private marker: any;
  private map: any;
  private AMap: any;
  private station: Station;
  private onClick?: (station: Station) => void;
  private currentMode: 'dot' | 'full' = 'dot';
  private infoWindow: StationInfoWindow | null = null;
  private boundZoomHandler: () => void;

  constructor(map: any, AMap: any, station: Station, onClick?: (station: Station) => void) {
    this.map = map;
    this.AMap = AMap;
    this.station = station;
    this.onClick = onClick;
    
    // 创建绑定后的函数引用
    this.boundZoomHandler = this.handleZoomChange.bind(this);
    // 监听地图缩放事件
    this.map.on('zoomend', this.boundZoomHandler);
    
    // 根据当前缩放级别设置初始模式
    const currentZoom = this.map.getZoom();
    this.currentMode = currentZoom >= 10 ? 'full' : 'dot';
    
    // 初始创建标记
    this.updateMarker();
  }

  private getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'normal': '#4bcc34',
      'error': '#f63c3c',
      'emergency': '#eeac0c',
      'inspection': '#5a99fc'
    };
    return colorMap[status] || colorMap['normal'];
  }

  private getImagePath(status: string): string {
    const statusMap: { [key: string]: string } = {
      'normal': 'Normal.png',
      'error': 'AbNormal.png',
      'emergency': 'EmergencyOpsing.png',
      'inspection': 'InspectionOpsing.png'
    };
    return new URL(`/src/assets/point/${statusMap[status]}`, import.meta.url).href;
  }

  private handleZoomChange() {
    const zoom = this.map.getZoom();
    const newMode = zoom >= 10 ? 'full' : 'dot';
    
    if (newMode !== this.currentMode) {
      this.currentMode = newMode;
      this.updateMarker();
    }
  }

  private createDotMarker() {
    const color = this.getStatusColor(this.station.status);
    
    // 创建圆点标记
    this.marker = new this.AMap.Marker({
      position: [this.station.longitude, this.station.latitude],
      offset: new this.AMap.Pixel(-10, -10),
      content: `<div style="
        width: 20px;
        height: 20px;
        background-color: ${color};
        border-radius: 50%;
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
      "></div>`
    });
  }

  private createFullMarker() {
    // 创建点位图标
    const icon = new this.AMap.Icon({
      size: new this.AMap.Size(40, 40),
      image: this.getImagePath(this.station.status),
      imageSize: new this.AMap.Size(40, 40)
    });

    // 创建完整标记点
    this.marker = new this.AMap.Marker({
      position: [this.station.longitude, this.station.latitude],
      icon: icon,
      title: this.station.name,
      offset: new this.AMap.Pixel(-20, -20),
      label: {
        content: this.station.name,
        direction: 'bottom',
        offset: new this.AMap.Pixel(0, 5)
      }
    });
  }

  private updateMarker() {
    console.log('updateMarker');

    // 移除现有标记
    if (this.marker) {
      this.map.remove(this.marker);
    }

    // 根据当前模式创建新标记
    if (this.currentMode === 'full') {
      this.createFullMarker();
    } else {
      this.createDotMarker();
    }

    // 添加点击事件
    this.marker.on('click', () => {
      // 调用外部点击回调
      if (this.onClick) {
        this.onClick(this.station);
      }

      // 显示信息窗体
      this.showInfoWindow();
    });

    // 添加到地图
    this.map.add(this.marker);
  }

  private showInfoWindow() {
    // 如果已经有信息窗体，先关闭
    if (this.infoWindow) {
      this.infoWindow.remove();
    }

    // 创建新的信息窗体
    this.infoWindow = new StationInfoWindow(this.map, this.AMap, this.station);
    this.infoWindow.open([this.station.longitude, this.station.latitude]);
  }

  // 从地图上移除点位
  public remove() {
    console.log('remove marker', this.station.id);
    if (this.marker) {
      // 移除缩放事件监听
      this.map.off('zoomend', this.boundZoomHandler);
      // 移除信息窗体
      if (this.infoWindow) {
        this.infoWindow.remove();
        this.infoWindow = null;
      }
      // 移除标记
      this.map.remove(this.marker);
      this.marker = null;
    }
  }
}
