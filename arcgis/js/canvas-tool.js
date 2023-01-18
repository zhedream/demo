// 水滴

// 3 点 顺时针
function getxy1(a, b, r, radian) {
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
  // 0:0   1:1  360:360  361:1 -361:-1
  // 取符号
  const sign = num < 0 ? -1 : 1;
  num = Math.abs(num);
  const rest = num % fullNum; // 余数
  const multiple = parseInt(num / fullNum); // 倍数
  if (rest == 0) {
    const isfullNum = multiple % 2 != 0;
    if (isfullNum) return fullNum * sign;
    return 0;
  }
  return rest * sign;
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

// 3 点 顺时针
function getCircleXY2(a, b, r, radian) {
  var x = a + Math.cos(radian) * r;
  var y = b + Math.sin(radian) * r;
  return [x, y];
}

// 已知圆心，半径，弧度，求圆上的点坐标, x 正半轴, 逆时针
function getCircleXY(x, y, radius, angle) {
  // 处理角度
  angle = loopNumber(angle, 360); // 处理大角度 >360° 或 < -360°
  if (angle < 0) angle = loopNumber(angle + 360, 360); // 处理成正角度
  const angleSin = mathSin(angle);
  const angleCos = mathCos(angle);
  return [angleCos * radius + x, angleSin * radius + y];
}

function mathSin(angle) {
  switch (angle) {
    case 0:
      return 0;
    case 30:
      return 0.5;
    case 90:
      return 1;
    case 150:
      return 0.5;
    case 180:
      return 0;
    case 210:
      return -0.5;
    case 270:
      return -1;
    case 330:
      return -0.5;
    case 360:
      return 0;
  }
  return Math.sin((angle * Math.PI) / 180);
}

function mathCos(angle) {
  switch (angle) {
    case 0:
      return 1;
    case 60:
      return 0.5;
    case 90:
      return 0;
    case 120:
      return -0.5;
    case 180:
      return -1;
    case 240:
      return -0.5;
    case 270:
      return 0;
    case 300:
      return 0.5;
    case 360:
      return 1;
  }
  return Math.cos((angle * Math.PI) / 180);
}

// 判断角度所在象限, x 正半轴, 顺时针
function getAngleQuadrant(angle) {
  switch (true) {
    case angle > 0 && angle < 90:
      return 4;
    case angle > 90 && angle < 180:
      return 3;
    case angle > 180 && angle < 270:
      return 2;
    case angle > 270 && angle < 360:
      return 1;
    default:
      return 0;
  }
}

// 判断弧度所在象限, x 正半轴, 顺时针
function getRadianQuadrant(radian) {
  const PI0 = 0;
  const PI90 = Math.PI * 0.5;
  const PI180 = Math.PI;
  const PI270 = Math.PI * 1.5;
  const PI360 = Math.PI * 2;
  switch (true) {
    case radian > PI0 && radian < PI90:
      return 4;
    case radian > PI90 && radian < PI180:
      return 3;
    case radian > PI180 && radian < PI270:
      return 2;
    case radian > PI270 && radian < PI360:
      return 1;
    default:
      return 0;
  }
}

for (let i = 0; i <= 360; i += 30) {
  let a = Math.cos((i * Math.PI) / 180);
  console.log(i + ":cos: ", a);
  console.log(i + ":mathCos: ", mathCos(i));
}
