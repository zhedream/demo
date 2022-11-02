<template>
  <div>
    {{ msg }}

    <demo2></demo2>
  </div>
</template>

<script>
import data from "./data.m.js";
console.log('data: ', data);
export default {
  data() {
    return {
      msg: "123123123",
    };
  },
  components: {
    demo2: loadAsyncComponent("./b.m.vue"),
  },
};
</script>
