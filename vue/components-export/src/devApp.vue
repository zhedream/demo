<template>
  <div class="header-menu">
    <div class="menu-left">Logo</div>

    <div class="menu-middle">
      <A-Menu v-if="true" v-model="current" mode="horizontal">
        <template v-for="menu1 in data">
          <!-- @一级菜单 -->
          <A-Menu-Item
            v-if="menu1.isUse && !menu1.haveSubMenu"
            :key="menu1.MenuCode"
            :class="'menu-item-code-' + menu1.MenuCode"
            :index="menu1.MenuCode"
          >
            <span>{{ menu1.MenuName }}</span>
          </A-Menu-Item>

          <!-- @2级菜单 -->
          <A-Sub-Menu
            v-else-if="
              menu1.isUse && menu1.haveSubMenu && !menu1.subMenu[0].haveSubMenu
            "
            :key="menu1.MenuCode"
            :index="menu1.MenuCode"
            class="submenu"
            popup-class-name="submenu-level-2"
          >
            <template slot="title">
              <!-- 一级菜单 分组 -->
              <span>{{ menu1.MenuName }}</span>
            </template>
            <!-- @二级菜单 -->
            <A-Menu-Item
              v-for="menu2 in menu1.subMenu"
              :key="menu2.MenuCode"
              :class="'menu-item-code-' + menu2.MenuCode"
              :index="menu2.MenuCode"
              :title="'menu-item-code-' + menu2.MenuCode"
            >
              <span>{{ menu2.MenuName }}</span>
            </A-Menu-Item>
          </A-Sub-Menu>
          <!-- @3级菜单 -->
          <A-Sub-Menu
            v-else-if="
              menu1.isUse && menu1.haveSubMenu && menu1.subMenu[0].haveSubMenu
            "
            :key="menu1.MenuCode"
            :index="menu1.MenuCode"
            class="submenu"
            popup-class-name="submenu-level-3"
          >
            <template slot="title">
              <!-- 一级菜单 分组 -->
              <span>{{ menu1.MenuName }}</span>
            </template>
            <A-Menu-Item-Group
              v-for="menu2 in menu1.subMenu"
              :key="menu2.MenuCode"
            >
              <!-- 二级菜单 分组 -->
              <span slot="title">{{ menu2.MenuName }}</span>
              <!-- @三级菜单 -->
              <A-Menu-Item
                v-for="menu3 in menu2.subMenu"
                :key="menu3.MenuCode"
                :class="'menu-item-code-' + menu3.MenuCode"
                :index="menu3.MenuCode"
                :title="'menu-item-code-' + menu3.MenuCode"
              >
                <span slot="title">{{ menu3.MenuName }}</span>
                <span> {{ menu3.MenuName }} </span>
              </A-Menu-Item>
            </A-Menu-Item-Group>
          </A-Sub-Menu>
        </template>
      </A-Menu>
    </div>

    <div class="menu-right" style="display: flex; flex-grow: row">
      <!-- 天气 -->
      <div class="weather1" style="display: flex">天气</div>

      <!-- 用户信息 -->
      <div class="userIcon">用户信息</div>
    </div>
  </div>
</template>

<script>
// import AButton from 'ant-design-vue/lib/button';
// import 'ant-design-vue/lib/button/style/css'; // 或者 ant-design-vue/lib/button/style/css 加载 css 文件

// import Menu from "ant-design-vue/lib/menu";
// import "ant-design-vue/lib/menu/style/index.less"; // 或者 ant-design-vue/lib/menu/style/css 加载 css 文件

import { Menu } from "ant-design-vue";

let AMenu = Menu;
let AMenuItem = AMenu.Item;
let ASubMenu = AMenu.SubMenu;
let AMenuItemGroup = AMenu.ItemGroup;

import data from "@/data.js";

export default {
  name: "app",
  components: {
    AMenu,
    AMenuItem,
    ASubMenu,
    AMenuItemGroup,
  },
  data() {
    return {
      text: " Test",
      current: [],
      data: data,
    };
  },
};
</script>

<style lang="less">
.header-menu {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  //background: linear-gradient(#1eabb1, #037c81);
  background-image: url(./banner_bg.png);
  background-repeat: repeat-x;
  // ====== 中间 菜单
  .menu-middle {
    margin-right: 40px;
    overflow: hidden;
    position: relative;
    flex: 1;
    display: flex;

    > ul {
      &.ant-menu {
        overflow: hidden;
        flex: 1;
        margin: 0;
        padding: 0;
        // 菜单 背景透明
        background: transparent;
        color: #fff;
        // 菜单下划线
        border-bottom: none;
        display: flex;
        align-items: center;
      }

      // 一级菜单 标题颜色 hover
      .ant-menu-item:hover,
      .ant-menu-item-active,
      .ant-menu-item-selected {
        color: #c9c9c9;
        border-bottom: 2px solid #000;
      }
      // submenu
      .ant-menu-submenu:hover,
      .ant-menu-submenu-active,
      .ant-menu-submenu-selected {
        color: #c9c9c9;
        border-bottom: 2px solid #000;
      }
      .ant-menu-submenu-title:hover {
        color: #c9c9c9;
      }

      // 剩余菜单
      .ant-menu-overflowed-submenu {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  // ======= 左侧 logo 系统标题

  // ======= 右侧 用户信息 天气
}

// 弹出菜单 2,3级 菜单
.submenu-level {
  &-2,
  &-3 {
    // .ant-menu:not(.ant-menu-horizontal)
    .ant-menu {
      // menu-item
      .ant-menu-item:hover,
      .ant-menu-item-active,
      .ant-menu-item-selected {
        // color: #1890ff;
        background-color: transparent;
      }

      // submenu
      .ant-menu-submenu:hover,
      .ant-menu-submenu-active,
      .ant-menu-submenu-selected {
        color: #c9c9c9;
        border-bottom: 3px solid #ccc;
      }
      .ant-menu-submenu-title:hover {
        color: #c9c9c9;
      }
    }
  }

  &-2 {
    > ul.ant-menu-sub {
      min-width: max-content;
    }
  }

  &-3 {
    .ant-menu-submenu-arrow {
      display: none;
    }

    > ul.ant-menu-sub {
      display: flex;
      min-width: max-content;

      .ant-menu-item-group {
        margin: 0 10px;
      }

      .ant-menu-item-group-title {
        font-weight: bold;
        padding-left: 0 !important;
        color: #000;
        border-bottom: 2px solid #000;
      }
    }
    // padding 宽度
    .ant-menu-item-group-list .ant-menu-item,
    .ant-menu-item-group-list .ant-menu-submenu-title {
      padding: 0;
      margin: 0;
    }
  }
}
</style>
