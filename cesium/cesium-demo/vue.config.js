const {defineConfig} = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    externals: {
      "cesium": "Cesium",
    }
  }

});
