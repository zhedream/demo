Vue.component('factor-component', {
  // render: h => h(App),
  template: '#project-header-template',
  props: [],
  data: function () {
    return {}
  },
  methods: {
    change: function (value) {
      this.$emit('change', value);
    }
  }
})