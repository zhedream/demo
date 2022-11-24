export default {
  data() {
    return {
      lastTabsModel: null,
    };
  },
  methods: {
    tabsModelKeyInOut(key, nextKey, inFn, outFn) {
      let lastTabsModel = this.lastTabsModel;
      if (lastTabsModel !== key && nextKey !== key) {
        return;
      }
      // 进入 key
      if (lastTabsModel !== key && nextKey === key) {
        inFn && inFn();
      } else if (lastTabsModel === key && nextKey !== key) {
        outFn && outFn();
      } else {
        // do nothing
      }
      this.$nextTick(() => {
        this.lastTabsModel = nextKey;
      });
    },
  },
};
