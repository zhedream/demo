import type { Project } from './MapManager';

export class ProjectMarker {
  private marker: any;
  private map: any;
  private AMap: any;
  private project: Project;
  private onClick?: (project: Project) => void;

  constructor(map: any, AMap: any, project: Project, onClick?: (project: Project) => void) {
    this.map = map;
    this.AMap = AMap;
    this.project = project;
    this.onClick = onClick;
    
    this.createMarker();
  }

  private createMarker() {
    // 创建点位图标
    const icon = new this.AMap.Icon({
      size: new this.AMap.Size(40, 40),
      image: new URL('/src/assets/point/enterprise.png', import.meta.url).href,
      imageSize: new this.AMap.Size(40, 40)
    });

    // 创建标记点
    this.marker = new this.AMap.Marker({
      position: [this.project.longitude, this.project.latitude],
      icon: icon,
      title: this.project.name,
      offset: new this.AMap.Pixel(-20, -20),
      label: {
        content: this.project.name,
        direction: 'bottom',
        offset: new this.AMap.Pixel(0, 5)
      }
    });

    // 添加点击事件
    this.marker.on('click', () => {
      if (this.onClick) {
        this.onClick(this.project);
      }
    });

    // 添加到地图
    this.map.add(this.marker);
  }

  // 从地图上移除点位
  public remove() {
    if (this.marker) {
      this.map.remove(this.marker);
      this.marker = null;
    }
  }
} 