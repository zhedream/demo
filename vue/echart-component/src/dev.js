import Vue from 'vue'

import devApp from './devApp.vue';

import EchartComponent from './index.js'
// import EchartComponent from '../dist/echart-component.js'

Vue.use(EchartComponent)

new Vue({
  render: h => h(devApp),
}).$mount('#app')

