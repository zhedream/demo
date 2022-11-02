<template>
  <div>
    {{ msg }}
  </div>
</template>

<script>
defineComponent((Vue, template) => {
  return {
    ...Vue.compile(template),
    name: "demo2",
    setup() {
      return {
        msg: "Heloise",
      };
    },
  };
});
</script>

<style></style>
