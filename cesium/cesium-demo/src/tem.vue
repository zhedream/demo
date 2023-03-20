<template>
  <div>
    {{ msg }}
    <div> {{ count }}</div>
    <div> {{ cc }}</div>
  </div>
</template>

<script>
export default {
  name: "tem",
  props: {
    msg: String,
  },
  data() {
    return {
      count: 1,
    };
  },
};
</script>
