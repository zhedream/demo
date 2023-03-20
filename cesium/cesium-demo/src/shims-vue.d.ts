declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "window" {
  declare var Cesium: any;
}
