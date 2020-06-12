<template>
  <a-modal
    title="选择时间列"
    v-model="showModel"
    okText="确认"
    cancelText="取消"
    width="600px"
    @ok="modalOK"
    @cancel="modalCancel"
  >
    <div style="height: 320px;overflow: auto;">
      <div v-for="(item,index) in data" :key="index" :style="{ borderBottom: '1px solid #E9E9E9' }">
        <div>
          <a-checkbox
            style="font-weight: bold;"
            @change="onCheckAllChange(item,$event)"
            :checked="item.checkedAll"
            :indeterminate="item.checkedHalf"
          >{{item.date}}</a-checkbox>
        </div>
        <a-checkbox-group
          :options="item.times"
          v-model="item.checkedList"
          @change="onChange(item,$event)"
        />
        <br />
      </div>
    </div>
  </a-modal>
</template>

<script>
import groupBy from "lodash/groupBy";
/* 数据大的话可能存性能问题 */
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    times: {
      type: Array,
      default: () => {
        return [];
      }
    },
    defaultTimes: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      showModel: false,
      data: []
    };
  },
  methods: {
    // 确定
    modalOK() {
      let arr = [];
      this.data.forEach(item => {
        arr = arr.concat(item.checkedList);
      });
      this.$emit("ok", arr);
      this.showModel = false;
      console.log(arr);
    },
    // 取消
    modalCancel() {
      this.dataHandle();
    },
    // 全选
    onCheckAllChange(item, e) {
      const { times, checkedList, checkedAll } = item;
      if (checkedAll == true) {
        item.checkedList = [];
        item.checkedAll = false;
        item.checkedHalf = false;
      } else {
        item.checkedList = times.map(time => time.value);
        item.checkedAll = true;
        item.checkedHalf = false;
      }
    },
    // 多选子checkbox 单选
    onChange(item, dateTimes) {
      const { times, checkedList } = item;
      item.checkedList = dateTimes;
      if (times.length == dateTimes.length) {
        item.checkedAll = true;
        item.checkedHalf = false;
      } else if (dateTimes.length == 0) {
        item.checkedAll = false;
        item.checkedHalf = false;
      } else {
        item.checkedAll = false;
        item.checkedHalf = true;
      }
    },
    // 处理 data
    dataHandle() {
      const times = this.times;
      const tem = groupBy(times, item => {
        return item.substring(0, 11);
      });
      // 默认选中时间
      const timeSelect = this.defaultTimes;
      let arr = [];
      for (let [key, val] of Object.entries(tem)) {
        // 1. 交集
        let intersection = val.filter(v => timeSelect.includes(v));
        let checkedAll, checkedHalf;
        if (val.length == intersection.length) {
          checkedAll = true;
          checkedHalf = false;
        } else if (intersection.length == 0) {
          checkedAll = false;
          checkedHalf = false;
        } else {
          checkedAll = false;
          checkedHalf = true;
        }
        // 2. 处理 label
        let timeList = val.map(time => {
          return { label: time.substring(10), value: time };
        });
        arr.push({
          date: key, // 日期
          times: timeList, // 时间
          checkedList: intersection, // 以选择列表
          checkedAll: checkedAll, // 全选
          checkedHalf: checkedHalf // 半选
        });
      }
      this.data = arr;
    }
  },
  computed: {},
  watch: {
    value(val) {
      this.showModel = val;
    },
    showModel(val) {
      this.$emit("input", val);
    },
    times() {
      this.dataHandle();
    }
  }
};
</script>

<style>
</style>