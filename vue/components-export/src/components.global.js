/*  导出 element-ui */

// 按需引入组件
// import {
//   Button,
//   Menu,
//   MenuItem,
//   Submenu,
//   MenuItemGroup,
//   // Icon
// } from "element-ui";
// let ElButton = Button;
// let ElMenu = Menu;
// let ElMenuItem = MenuItem;
// let ElSubmenu = Submenu;
// let ElMenuItemGroup = MenuItemGroup;

// 手动引入 需要 jsx  配置 jsx 解析, 可让打包体积更小些
// import ElButton from "element-ui/packages/button";
// import ElMenu from "element-ui/packages/menu";
// import ElMenuItem from "element-ui/packages/menu-item";
// import ElSubmenu from "element-ui/packages/submenu";
// import ElMenuItemGroup from "element-ui/packages/menu-item-group";

// 按需引入样式
// import "./element.import.scss"; // 报错
// import "./element.import.js"; // 可以

/*  导出 ant-design-vue */

import { Button, Menu } from "ant-design-vue";
import { Icon } from "ant-design-vue";

let AButton = Button;
let AMenu = Menu;
let AMenuItem = Menu.Item;
let ASubMenu = Menu.SubMenu;
let AMenuItemGroup = Menu.ItemGroup;
let AIcon = Icon;

// import AButton from "ant-design-vue/lib/button";
// import "ant-design-vue/lib/button/style/css";

// import Menu from "ant-design-vue/lib/menu";

// let AMenu = Menu;
// let AMenuItem = Menu.Item;
// let ASubMenu = Menu.SubMenu;
// let AMenuItemGroup = Menu.ItemGroup;

// import "ant-design-vue/lib/menu/style/css";

// import AIcon from "ant-design-vue/lib/icon";
// import "ant-design-vue/lib/icon/style/css";

const components = {
  // ElButton,
  // ElMenu,
  // ElMenuItem,
  // ElSubmenu,
  // ElMenuItemGroup,
  // ant design
  AButton,
  AMenu,
  AMenuItem,
  ASubMenu,
  AMenuItemGroup,
  AIcon,
};

const install = function (Vue, opts = {}) {
  if (install.installed) return;

  Object.keys(components).forEach((key) => {
    Vue.component(key, components[key]);
  });
};

// auto install
if (typeof window !== undefined && window.Vue) {
  install(window.Vue);
}

const API = {
  version: process.env.VERSION,
  install,
  ...components,
};

export default API;
