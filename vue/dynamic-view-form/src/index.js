import DynamicIviewForm from './DynamicIviewForm.vue';


const components = {
  DynamicIviewForm
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
  version: process.env.VERSION, // eslint-disable-line no-undef
  // locale: locale.use,
  // i18n: locale.i18n,
  install,
  ...components
};

// module.exports.default = module.exports = API;   // eslint-disable-line no-undef