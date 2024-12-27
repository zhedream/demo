import type { Project, Station } from '../utils/MapManager';

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: '北京项目',
    longitude: 116.397428,
    latitude: 39.90923,
    district: '北京市',
    adcode: '110000'
  },
  {
    id: 'p2',
    name: '上海项目',
    longitude: 121.473701,
    latitude: 31.230416,
    district: '上海市',
    adcode: '310000'
  },
  {
    id: 'p3',
    name: '广州项目',
    longitude: 113.264385,
    latitude: 23.129112,
    district: '广州市',
    adcode: '440000'
  },
  {
    id: 'p4',
    name: '成都项目',
    longitude: 104.065735,
    latitude: 30.659462,
    district: '成都市',
    adcode: '510000'
  },
  {
    id: 'p5',
    name: '武汉项目',
    longitude: 114.305393,
    latitude: 30.593099,
    district: '武汉市',
    adcode: '420000'
  },
];

// 生成随机站点数据的辅助函数
function generateRandomStations(projectId: string, count: number, baseLocation: { longitude: number; latitude: number }): Station[] {
  const stations: Station[] = [];
  const statuses: Array<'normal' | 'error' | 'emergency' | 'inspection'> = ['normal', 'error', 'emergency', 'inspection'];
  
  for (let i = 0; i < count; i++) {
    // 在基准位置周围随机生成经纬度（范围约为20公里内）
    const randomLng = baseLocation.longitude + (Math.random() - 0.5) * 0.2;
    const randomLat = baseLocation.latitude + (Math.random() - 0.5) * 0.2;
    
    stations.push({
      id: `${projectId}-s${i + 1}`,
      projectId,
      name: `${projectId}站点${i + 1}`,
      longitude: randomLng,
      latitude: randomLat,
      district: mockProjects.find(p => p.id === projectId)?.district || '',
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }
  
  return stations;
}

// 为每个项目预生成站点数据
export const mockStations: Record<string, Station[]> = {};
mockProjects.forEach(project => {
  mockStations[project.id] = generateRandomStations(
    project.id,
    Math.floor(Math.random() * 5) + 5, // 每个项目5-10个站点
    {
      longitude: project.longitude,
      latitude: project.latitude,
    }
  );
});
