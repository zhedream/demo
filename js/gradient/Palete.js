// 调色板2
function Palete(colors) {
  this.colors = colors;
  let canvas = createCanvas(1, 256);
  // document.body.append(canvas);
  let ctx = canvas.getContext("2d");
  let grad = ctx.createLinearGradient(0, 0, 1, 256);

  // let gradient = {
  //   0: "#000000",
  //   0.1: "#31167e",
  //   0.2: "#0006ff",
  //   0.3: "#008b15",
  //   0.4: "#5eaf1e",
  //   0.6: "#ffa000",
  //   0.8: "#ed0808",
  //   1.0: "#8e0505",
  // };
  // for (let x in gradient) {
  //   grad.addColorStop(parseFloat(x), gradient[x]);
  // }

  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    grad.addColorStop(parseFloat(i / colors.length), color);
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 10, 256);
  const palette = ctx.getImageData(0, 0, 1, 256).data;
  this.palette = palette;
  // this.getColor = function (min, max, val) {
  //   let index = Math.floor(((val - min) / (max - min)) * 255);
  //   return `rgb(${palette[index * 4]},${palette[index * 4 + 1]},${
  //     palette[index * 4 + 2]
  //   })`;
  // };
}
Palete.prototype.getColor = function (mix, max, val) {
  let index = Math.floor(((val - mix) / (max - mix)) * 255);
  return `rgb(${this.palette[index * 4]},${this.palette[index * 4 + 1]},${
    this.palette[index * 4 + 2]
  })`;
};

function createCanvas(width, height) {
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
