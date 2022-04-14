<template>
  <div>
    devApp {{ text }}

    <div style="height: 300px">
      <EchartComponent :option="option"></EchartComponent>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      text: " Test",
      option: {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      },
    };
  },
};
</script>

<style></style>
