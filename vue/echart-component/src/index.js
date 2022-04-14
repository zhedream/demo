import EchartComponent from './EchartComponent.vue';


const components = {
  EchartComponent
}

const install = function (Vue, opts = {}) {
  if (install.installed) return;

  Object.keys(components).forEach(key => {
    Vue.component(key, components[key]);
  });

};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

const API = {
  version: process.env.VERSION,
  install,
  ...components
};

export default API;
