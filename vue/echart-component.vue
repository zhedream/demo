<template>
  <!-- vue.ant 的 loading -->
  <a-spin :spinning="loading">
    <div ref="container" class="content echart-content" :style="{width:widthPx,height:heightPx}">
      <div ref="chart" :id="id"></div>
    </div>
  </a-spin>
</template>

<script>
var echarts = require("echarts");
export default {
  props: {
    option: {
      type: Object,
      default: () => {
        return {};
      }
    },
    theme: {
      type: Object,
      default: () => {
        return {};
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    resizeBus: {
      type: Object,
      default: () => {
        return null;
      }
    },
    id: {
      type: String,
      default: "echartID"
    },
    width: {
      type: String,
      default: "auto"
    },
    height: {
      type: String,
      default: "auto"
    }
  },
  data() {
    return {
      echart: null,
      mountedOnce: true // 第一次或重新挂载 执行 contentSize,
    };
  },
  created() {
    // console.log(this.id + "created");
    if (this.resizeBus != null) {
      this.resizeBus.$on("resize", status => {
        if (this.mountedOnce == true) this.contentSize();
        if (status == true) this.contentSize(); // 强制 resize
      });
    }
  },
  mounted() {
    // console.log(this.id + "mounted");

    if (Object.keys(this.option).length !== 0)
      this.echart = echarts.init(document.getElementById(this.id), this.theme);
    else this.echart = echarts.init(document.getElementById(this.id)); // 实例化

    this.echart.on("click", params => {
      this.$emit("click", params);
    }); // click 事件
    window.addEventListener("resize", () => {
      // console.count(this.id + "resize");
      this.contentSize();
    }); // 自适应

    this.mountedOnce = true;
    if (Object.keys(this.option).length !== 0) {
      this.setEchart();
    } // v-if 重新设置 option
  },
  updated() {},
  beforeDestroy() {
    console.log(this.id + ":beforeDestroy");
  },
  methods: {
    contentSize() {
      const container = this.$refs.container; // 容器
      let chart = this.$refs.chart; // 图表
      if (container == undefined) {
        console.warn(this.id + ":容器未初始化");
        return;
      }
      if (chart == undefined) {
        console.warn(this.id + ":chart未初始化");
        return;
      }
      const getStyle = el => {
        if (globalThis.getComputedStyle) {
          let res = globalThis.getComputedStyle(el, null);
          return res;
        } else {
          return el.currentStyle;
        }
      };
      setTimeout(() => {
        let wi = getStyle(container).width;
        let hi = getStyle(container).height;
        chart.style.width = wi;
        chart.style.height = hi;
        if (this.echart) {
          // console.log(wi + "宽度" + this.id);
          if (wi.includes("px")) this.mountedOnce = false;
          else this.mountedOnce = true;
          this.echart.resize();
        } else {
          console.warn(this.id + "echart未初始化");
        }
      }, 0);
    },
    setEchart() {
      this.echart.clear();
      this.echart.setOption(this.option);
      this.contentSize();
    }
  },
  computed: {
    widthPx() {
      if (this.width == "auto") return false;
      let px = parseInt(this.width) + "px";
      return px;
    },
    heightPx() {
      if (this.height == "auto") return false;
      let px = parseInt(this.height) + "px";
      return px;
    }
    // optionWatch: () => {
    //   // console.count(this.id + ":optionCpd");
    //   this.setEchart();
    //   return this.option;
    // }
  },
  watch: {
    option() {
      // console.count(this.id + ":watch");
      // console.timeEnd(this.id);
      this.setEchart();
    },
    // deep: true,
    immediate: true
  }
};
</script>

<style scoped>
.content {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
</style>

