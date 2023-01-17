// 水滴

// 3 点 顺时针
export function getxy1(a, b, r, radian) {
  let X = a + Math.cos(radian) * r;
  let Y = b + Math.sin(radian) * r;
  return [X, Y];
}

// 角度转弧度
function toRadian(angle) {
  // while (angle < 0) angle += 360;
  return (loopNumber(angle, 360) * Math.PI) / 180;
}

// 数循环
function loopNumber(num, fullNum) {
  // 0:0   1:1  360:360  361:1
  const rest = num % fullNum; // 余数
  const multiple = parseInt(num / fullNum); // 倍数
  if (rest == 0) {
    const isfullNum = multiple % 2 != 0;
    if (isfullNum) return fullNum;
    return 0;
  }
  return rest;
}

/**
 * 画水滴坐标点 base64
 * @param {*} text 显示的文字
 */
function getPointCanvas(text) {
  // locationPoint
  const PI = Math.PI;
  const R = 50; // 半径
  const an = 75; // 角度
  const angle1 = -180 - an; // 起弧度
  const angle2 = an; // // 终弧度
  const center = [R, R]; // 圆心

  const canvas = document.createElement("canvas");

  canvas.width = R * 2;
  const triangleHeight = 3;
  canvas.height = (R * 2 + triangleHeight) * 2 + 10; // 两倍的图形
  const ctx = canvas.getContext("2d");

  // const center = [canvas.width / 2, canvas.height / 2]; // 圆心(相对画布)

  let xy1 = getxy1(...center, R, toRadian(angle1));
  let xy2 = getxy1(...center, R, toRadian(angle2));

  // 半圆
  ctx.beginPath();
  ctx.arc(...center, R, toRadian(angle1), toRadian(angle2), false);
  // ctx.fillStyle = '#3d93fd';
  // ctx.fill();
  // ctx.closePath();

  // 三角
  // ctx.beginPath();
  ctx.moveTo(...xy1);
  ctx.lineTo(...xy2);
  ctx.lineTo(canvas.width / 2, canvas.height / 2); // 画布中心
  ctx.fillStyle = "#3d93fd";
  ctx.fill();
  ctx.closePath();

  // drawHelpLines(ctx, canvas);

  // 文字
  ctx.beginPath();
  ctx.font = "60px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  // ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height / 2 - 10);
  ctx.fillText(text, center[0], center[1] + 20);
  ctx.closePath();

  // drawRect(ctx, ...xy1)
  // drawRect(ctx, ...xy2)
  return canvas;
}

function cloneCanvas(oldCanvas) {
  //create a new canvas
  var newCanvas = document.createElement("canvas");
  var context = newCanvas.getContext("2d");

  //set dimensions
  newCanvas.width = oldCanvas.width;
  newCanvas.height = oldCanvas.height;

  //apply the old canvas to the new one
  context.drawImage(oldCanvas, 0, 0);

  //return the new canvas
  return newCanvas;
}

function createCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

// 函数劫持 result
function hookFunction(fn, hook) {
  return function () {
    const args = Array.prototype.slice.call(arguments);
    const result = fn.apply(this, args);
    return hook(result, args);
  };
}

function hijackFunction(fn, callback) {
  return function () {
    callback.apply(this, arguments);
    return fn.apply(this, arguments);
  };
}
