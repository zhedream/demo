<template>
  <!-- vue.ant 的 loading -->
  <div ref="container" class="echart-component-container">
    <!-- <a-spin :spinning="loading"> -->
    <div style="height: 100%" ref="chart" :id="id"></div>
    <!-- </a-spin> -->
  </div>
</template>

<script>
/*

<EchartComponent
  ref="echartRef"
  id="echartId"
  style="height:750px"
  :option="option"
  :loading="isLoading"
  :events="['click']"
  @click="click"
  v-if="dataSource.length > 0"
></EchartComponent>

1. 改进方向 按需加载
https://www.jianshu.com/p/cf0a54374419


*/

import * as echarts from "echarts";

// var echarts = require("echarts");

export default {
  name: "EchartComponent",
  props: {
    id: {
      type: String,
      default: () => Math.random().toString(32).substr(2),
    },
    // 自动 setOption 前 clear
    clear: {
      type: Boolean,
      default: true,
    },
    option: {
      type: Object,
      default: () => {
        return {};
      },
    },
    theme: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // loading: {
    //   type: Boolean,
    //   default: false,
    // },
    events: {
      type: Array,
      default: () => {
        return ["click"];
      },
    },
  },
  data() {
    this.ob = null; // 自适应1

    this.container = null; // 容器 this.$el

    this.echart = null; // echart 实例
    this.echartDom = null; // echart Dom

    this.lastWidth = null;
    this.lastHeight = null;

    return {};
  },
  methods: {
    resize() {
      if (!this.echart) return;
      this.echart.resize();
    },
    initEchart() {
      let echart = null;
      const chartDom = document.getElementById(this.id);
      if (!chartDom) return;
      if (!this.container) return;

      if (Object.keys(this.theme).length !== 0)
        echart = echarts.init(chartDom, this.theme);
      else echart = echarts.init(chartDom); // 实例化
      echart.setOption(this.option);
      echart.resize();

      this.echart = echart;

      this.initEvents();
      this.initAutoResize();
    },
    // 事件
    initEvents() {
      this.events.forEach((eventName) => {
        this.echart.on(eventName, (params) => {
          this.$emit(eventName, params);
        });
      });
    },
    removeEvents() {
      this.events.forEach((eventName) => {
        this.echart.off(eventName);
      });
    },
    removeEchart() {
      this.removeEvents();
      this.removeAutoResize();
      this.echart.clear(); // 清空实例
      this.echart.dispose(); // 销毁实例
    },
    getEchart() {
      return this.echart;
    },
    setOption(option) {
      if (!this.echart) return;
      if (this.clear) this.echart.clear();
      this.echart.setOption(option);
    },
    // 自动 resize
    initAutoResize() {
      this.removeDomResize = domResize(this.container, this.resize);
    },
    removeAutoResize() {
      if (this.removeDomResize instanceof Function) {
        this.removeDomResize();
        this.removeDomResize = null;
      }
    },
  },
  mounted() {
    console.log("mounted: ");
    this.container = this.$el;
    this.initEchart();
  },
  beforeDestroy() {
    this.removeEchart();
  },
  watch: {
    option(next) {
      // console.count(this.id + ":watch");
      // console.timeEnd(this.id);
      this.setOption(next);
      this.resize();
    },
    // deep: true,
    immediate: true,
  },
};

function domResize(selector, callback, timeout = 100) {
  const that = callback;
  let container;
  if (selector instanceof HTMLElement) container = selector;
  else container = document.querySelector(selector);

  // 监测 宽度变化
  const lastWidth_symbol = Symbol("lastWidth");
  const lastHeight_symbol = Symbol("lastHeight");
  const time_symbol = Symbol("time");
  if (window.ResizeObserver) {
    const ob_symbol = Symbol("ob");

    const Observer = (entries) => {
      if (that[time_symbol]) {
        clearTimeout(that[time_symbol]);
        that[time_symbol] = null;
      }
      that[time_symbol] = setTimeout(() => {
        for (let entry of entries) {
          const cr = entry.contentRect;
          // console.log("Element:", entry.target);
          // console.log(`Element size: ${cr.width}px x ${cr.height}px`);
          // console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);

          if (cr.width > 0 && cr.width !== that[lastWidth_symbol]) {
            that[lastWidth_symbol] = cr.width;
            callback();
            return;
          }
          if (cr.height > 0 && cr.height !== that[lastHeight_symbol]) {
            that[lastHeight_symbol] = cr.height;
            callback();
            return;
          }
        }
      }, timeout);
    };
    that[ob_symbol] = new ResizeObserver((entries) => Observer(entries));
    that[ob_symbol].observe(container);
    return () => that[ob_symbol].disconnect();
  } else {
    const onresize = () => {
      if (that[time_symbol]) {
        clearTimeout(that[time_symbol]);
        that[time_symbol] = null;
      }
      that[time_symbol] = setTimeout(() => callback(), timeout);
    };
    window.addEventListener("resize", onresize);
    return () => window.removeEventListener("resize", onresize);
  }
}
</script>

<style lang="less">
.echart-component-container {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;

  // .ant-spin-nested-loading {
  //   height: 100%;
  // }

  // .ant-spin-container {
  //   height: 100%;
  // }
}
</style>
