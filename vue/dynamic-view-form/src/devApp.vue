<template>
  <div>
    devApp {{text}}
    <dynamic-iview-form></dynamic-iview-form>
  </div>
</template>

<script>
import DynamicIviewForm from "./DynamicIviewForm.vue";
export default {
  name: "app",
  components: { DynamicIviewForm },
  data() {
    return {
      text: "HAHAHA"
    };
  }
};
</script>

<style>
</style>