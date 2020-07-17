import Vue from 'vue'

import 'iview/dist/styles/iview.css';
import iView from 'iview';
Vue.use(iView);

import devApp from './devApp.vue';

new Vue({
  render: h => h(devApp),
}).$mount('#app')

