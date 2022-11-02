import Vue from "vue";

import devApp from "./devApp.vue";

import ComponentsGlobal from "./components.global.js";
// import ComponentsGlobal from '../dist/components.global.js'


Vue.use(ComponentsGlobal);

new Vue({
  render: (h) => h(devApp),
}).$mount("#app");
