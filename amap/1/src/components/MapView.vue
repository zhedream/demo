<template>
  <div class="map-container">
    <div id="map" class="map"></div>
    <div class="controls">
      <button class="back-btn" @click="handleBack" v-if="showBackButton">
        返回
      </button>
      <div class="status-filter" v-if="showStatusFilter">
        <button 
          v-for="status in statusOptions" 
          :key="status.value"
          @click="filterByStatus(status.value)"
          :class="{ active: currentStatus === status.value }"
        >
          {{ status.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MapManager } from '../utils/MapManager';
import { apiService } from '../services/ApiService';
import type { Project, Station } from '../utils/MapManager';

const mapManager = new MapManager();
const showBackButton = ref(false);
const showStatusFilter = ref(false);
const currentProject = ref<Project | null>(null);
const currentStations = ref<Station[]>([]);
const currentStatus = ref('');

const statusOptions = [
  { label: '全部', value: '' },
  { label: '正常', value: 'normal' },
  { label: '异常', value: 'error' },
  { label: '应急运维中', value: 'emergency' },
  { label: '巡检运维中', value: 'inspection' },
];

onMounted(async () => {
  await mapManager.initMap('map');
  const projects = await apiService.getProjects();
  await mapManager.showProjects(projects);
});

async function handleProjectClick(project: Project) {
  currentProject.value = project;
  showBackButton.value = true;
  showStatusFilter.value = true;
  
  const stations = await apiService.getStations(project.id);
  currentStations.value = stations;
  
  await mapManager.showStations(stations);
  await mapManager.showDistrict(project.adcode);
}

async function handleBack() {
  showBackButton.value = false;
  showStatusFilter.value = false;
  currentProject.value = null;
  currentStations.value = [];
  currentStatus.value = '';
  
  mapManager.clearStations();
  await mapManager.resetToNationalView();
  const projects = await apiService.getProjects();
  await mapManager.showProjects(projects);
}

function filterByStatus(status: string) {
  currentStatus.value = status;
  if (status === '') {
    mapManager.showStations(currentStations.value);
  } else {
    mapManager.filterStationsByStatus(currentStations.value, status);
  }
}

// 注册到MapManager的回调
mapManager.onProjectClick = handleProjectClick;
mapManager.onStationClick = (station: Station) => {
  // 这里可以显示站点详情，比如用弹窗展示
  console.log('Station clicked:', station);
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.back-btn {
  padding: 8px 16px;
  background: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.status-filter {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.status-filter button {
  padding: 8px 16px;
  background: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.status-filter button.active {
  background: #3366FF;
  color: #fff;
}
</style>
