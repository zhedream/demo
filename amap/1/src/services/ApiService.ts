import type { Project, Station } from '../utils/MapManager';
import { mockProjects, mockStations } from './mockData';

export class ApiService {
  async getProjects(): Promise<Project[]> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProjects;
  }

  async getStations(projectId: string): Promise<Station[]> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStations[projectId] || [];
  }

  // 获取站点详细信息
  async getPointInfo(stationId: string): Promise<{
    deviceCount: number;
    lastUpdate: string;
    powerConsumption: number;
    temperature: number;
    humidity: number;
    status: {
      normal: number;
      error: number;
      total: number;
    };
  }> {
    // 模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          deviceCount: Math.floor(Math.random() * 100) + 20,
          lastUpdate: new Date().toLocaleString(),
          powerConsumption: +(Math.random() * 1000).toFixed(2),
          temperature: +(Math.random() * 30 + 10).toFixed(1),
          humidity: +(Math.random() * 50 + 30).toFixed(1),
          status: {
            normal: Math.floor(Math.random() * 80) + 10,
            error: Math.floor(Math.random() * 10),
            total: Math.floor(Math.random() * 90) + 20
          }
        });
      }, 500);
    });
  }
}

// 导出 ApiService 实例
export const apiService = new ApiService();
