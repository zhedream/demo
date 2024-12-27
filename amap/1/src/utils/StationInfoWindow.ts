import type { Station } from './MapManager';
import { apiService } from '../services/ApiService';

export class StationInfoWindow {
  private infoWindow: any;
  private map: any;
  private AMap: any;
  private station: Station;
  private loading: boolean = false;
  private windowId: string;

  constructor(map: any, AMap: any, station: Station) {
    this.map = map;
    this.AMap = AMap;
    this.station = station;
    this.windowId = `station-${this.station.id}-${Date.now()}`;
    this.createInfoWindow();
  }

  private async createInfoWindow() {
    // 创建基础信息内容
    const basicInfo = this.createBasicInfoContent();

    // 创建信息窗体
    this.infoWindow = new this.AMap.InfoWindow({
      isCustom: true,
      content: this.createWindowContent(basicInfo, '加载中...'),
      offset: new this.AMap.Pixel(0, -10),
      closeWhenClickMap: true,
      // 添加关闭事件处理
      onClose: () => {
        if (this.infoWindow) {
          this.infoWindow = null;
        }
      }
    });

    // 加载详细信息
    this.loading = true;
    try {
      const detailInfo = await apiService.getPointInfo(this.station.id);
      const detailContent = this.createDetailInfoContent(detailInfo);
      if (this.infoWindow) {
        this.infoWindow.setContent(this.createWindowContent(basicInfo, detailContent));
        // 重新绑定关闭按钮事件
        this.bindCloseButton();
      }
    } catch (error) {
      console.error('获取站点详情失败:', error);
      if (this.infoWindow) {
        this.infoWindow.setContent(this.createWindowContent(basicInfo, '获取详情失败'));
        // 重新绑定关闭按钮事件
        this.bindCloseButton();
      }
    } finally {
      this.loading = false;
    }
  }

  private createBasicInfoContent(): string {
    const statusText: { [key: string]: string } = {
      'normal': '正常',
      'error': '故障',
      'emergency': '紧急',
      'inspection': '巡检'
    };

    return `
      <div class="info-header">
        <div class="info-title">${this.station.name}</div>
        <div class="close-btn" id="${this.windowId}-close">&times;</div>
      </div>
      <div class="info-body">
        <div class="info-item">
          <span class="label">状态</span>
          <span class="value status-tag ${this.station.status}">
            ${statusText[this.station.status] || this.station.status}
          </span>
        </div>
        <div class="info-item">
          <span class="label">位置</span>
          <span class="value">${this.station.district}</span>
        </div>
      </div>
    `;
  }

  private createDetailInfoContent(detail: any): string {
    return `
      <div class="detail-info">
        <div class="detail-grid">
          <div class="grid-item">
            <div class="item-label">设备数量</div>
            <div class="item-value">${detail.deviceCount}</div>
          </div>
          <div class="grid-item">
            <div class="item-label">功耗</div>
            <div class="item-value">${detail.powerConsumption}<small>kW/h</small></div>
          </div>
          <div class="grid-item">
            <div class="item-label">温度</div>
            <div class="item-value">${detail.temperature}<small>°C</small></div>
          </div>
          <div class="grid-item">
            <div class="item-label">湿度</div>
            <div class="item-value">${detail.humidity}<small>%</small></div>
          </div>
        </div>

        <div class="status-bar">
          <div class="status-item">
            <span class="status-dot normal"></span>
            <span class="status-label">正常</span>
            <span class="status-value">${detail.status.normal}</span>
          </div>
          <div class="status-item">
            <span class="status-dot error"></span>
            <span class="status-label">故障</span>
            <span class="status-value">${detail.status.error}</span>
          </div>
          <div class="status-item">
            <span class="status-label">总数</span>
            <span class="status-value">${detail.status.total}</span>
          </div>
        </div>

        <div class="update-time">
          最后更新：${detail.lastUpdate}
        </div>
      </div>
    `;
  }

  private createWindowContent(basicInfo: string, detailInfo: string): string {
    return `
      <div class="station-info-window">
        <style>
          .station-info-window {
            padding: 0;
            width: 320px;
            font-size: 14px;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            background: #fff;
            overflow: hidden;
          }
          .info-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 15px;
            background: #f8f9fa;
            border-bottom: 1px solid #eee;
          }
          .info-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
          }
          .close-btn {
            cursor: pointer;
            font-size: 20px;
            color: #999;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            border-radius: 50%;
            transition: all 0.3s;
          }
          .close-btn:hover {
            background: #eee;
            color: #666;
          }
          .info-body {
            padding: 15px;
            border-bottom: 1px solid #eee;
          }
          .info-item {
            margin: 8px 0;
            display: flex;
            align-items: center;
          }
          .label {
            color: #666;
            width: 60px;
          }
          .value {
            color: #333;
            flex: 1;
          }
          .status-tag {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            color: #fff;
          }
          .status-tag.normal { background: #4bcc34; }
          .status-tag.error { background: #f63c3c; }
          .status-tag.emergency { background: #eeac0c; }
          .status-tag.inspection { background: #5a99fc; }
          
          .detail-info {
            padding: 15px;
          }
          .detail-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 15px;
          }
          .grid-item {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 6px;
          }
          .item-label {
            color: #666;
            font-size: 12px;
            margin-bottom: 4px;
          }
          .item-value {
            color: #333;
            font-size: 16px;
            font-weight: 500;
          }
          .item-value small {
            font-size: 12px;
            color: #999;
            margin-left: 2px;
          }
          .status-bar {
            display: flex;
            justify-content: space-between;
            background: #f8f9fa;
            padding: 10px;
            border-radius: 6px;
            margin: 15px 0;
          }
          .status-item {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
          .status-dot.normal { background: #4bcc34; }
          .status-dot.error { background: #f63c3c; }
          .status-label {
            color: #666;
            font-size: 12px;
          }
          .status-value {
            color: #333;
            font-weight: 500;
          }
          .update-time {
            color: #999;
            font-size: 12px;
            text-align: right;
          }
        </style>
        ${basicInfo}
        ${detailInfo}
      </div>
    `;
  }

  private bindCloseButton() {
    console.log('bindCloseButton', this.windowId);
    
    // 等待 DOM 更新
    setTimeout(() => {
      const closeBtn = document.getElementById(`${this.windowId}-close`);
      if (closeBtn) {
        closeBtn.onclick = this.handleClose.bind(this);
      } else {
        console.error('未找到关闭按钮:', this.windowId);
      }
    }, 0);
  }

  private handleClose = () => {
    if (this.infoWindow) {
      this.infoWindow.close();
      this.infoWindow = null;
    }
  }

  public open(position: [number, number]) {
    if (this.infoWindow) {
      this.infoWindow.open(this.map, position);
      // 绑定关闭按钮事件
      this.bindCloseButton();
    }
  }

  public close() {
    if (this.infoWindow) {
      this.infoWindow.close();
      this.infoWindow = null;
    }
  }

  public remove() {
    if (this.infoWindow) {
      this.close();
    }
  }
}
