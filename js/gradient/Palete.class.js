class Palete {
  constructor(colors) {
    this.colors = colors;
    let canvas = createCanvas(1, 256);
    let ctx = canvas.getContext("2d");
    let grad = ctx.createLinearGradient(0, 0, 1, 256);

    for (let i = 0; i < colors.length; i++) {
      const color = colors[i];
      grad.addColorStop(parseFloat(i / colors.length), color);
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 10, 256);
    const palette = ctx.getImageData(0, 0, 1, 256).data;
    this.palette = palette;
  }
  getColor(mix, max, val) {
    let index = Math.floor(((val - mix) / (max - mix)) * 255);
    return `rgb(${this.palette[index * 4]},${this.palette[index * 4 + 1]},${
      this.palette[index * 4 + 2]
    })`;
  }
}

function createCanvas(width, height) {
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}