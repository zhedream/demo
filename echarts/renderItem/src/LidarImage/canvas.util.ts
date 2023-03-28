//
/**
 * 获取圆上坐标, 已知圆心，半径，角度，求圆上的点坐标
 * @param x 圆心坐标 x
 * @param y 圆心坐标 y
 * @param radius 半径
 * @param angle 角度, 3 点 顺时针
 * @returns {*[]}
 */
//  function getCircleXY(x, y, r, radian) {
//   let X = x + Math.cos(radian) * r;
//   let Y = y + Math.sin(radian) * r;
//   return [X, Y];
// }


// 已知圆心，半径，弧度，求圆上的点坐标, x 正半轴, 逆时针
export function getCircleXY(x, y, radius, angle) {
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


// 角度转弧度
export function toRadian(angle) {
  // while (angle < 0) angle += 360;
  return (loopNumber(angle, 360) * Math.PI) / 180;
}

// 数循环
export function loopNumber(num, fullNum) {
  // 0:0   1:1  360:360  361:1 -361:-1
  // 取符号
  const sign = num < 0 ? -1 : 1;
  num = Math.abs(num);
  const rest = num % fullNum; // 余数
  const multiple = parseInt(String(num / fullNum)); // 倍数
  if (rest == 0) {
    const isfullNum = multiple % 2 != 0;
    if (isfullNum) return fullNum * sign;
    return 0;
  }
  return rest * sign;
}

export function cloneCanvas(oldCanvas) {
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

export function createCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * 画水滴坐标点
 * @param {*} text 显示的文字, 单个文字, 如序号 1
 * @param fontColor
 * @param backgroundColor
 */
export function getWaterDropCanvas(text, fontColor = "#ffffff", backgroundColor = "#3d93fd") {
  // locationPoint
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

  let xy1 = getCircleXY(center[0], center[1], R, angle1);
  let xy2 = getCircleXY(center[0], center[1], R, angle2);

  // 半圆
  ctx.beginPath();
  ctx.arc(center[0], center[1], R, toRadian(angle1), toRadian(angle2), false);
  // ctx.fillStyle = '#3d93fd';
  // ctx.fill();
  // ctx.closePath();

  // 三角
  // ctx.beginPath();
  ctx.moveTo(xy1[0], xy1[1]);
  ctx.lineTo(xy2[0], xy2[1]);
  ctx.lineTo(canvas.width / 2, canvas.height / 2); // 画布中心
  ctx.fillStyle = backgroundColor;
  ctx.fill();
  ctx.closePath();

  // drawHelpLines(ctx, canvas);

  // 文字
  if (text) {
    ctx.beginPath();
    ctx.font = "60px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillStyle = fontColor;
    // ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height / 2 - 10);
    ctx.fillText(text, center[0], center[1] + 20);
    ctx.closePath();
  }

  // drawRect(ctx, ...xy1)
  // drawRect(ctx, ...xy2)
  return canvas;
}

/**
 *
 * @param src src,base64
 * @returns {Promise<HTMLImageElement>}
 */
export function getImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject(img);
    };
  });
}

/**
 * 获取文本标签 边框,背景,文字
 * @param text
 * @param option
 * @returns {HTMLCanvasElement}
 */
export function getTextCanvas(text, option) {

  // let option1 = {
  //   fontSize: 36,
  //   color: "#000000",
  //   backgroundColor: "rgba(248,248,248,0.8)",
  //   paddingRight: 14,
  //   paddingLeft: 14,
  //   paddingTop: 14,
  //   paddingBottom: 14,
  //   border: {
  //     color: "#43aa37",
  //     width: 4,
  //   },
  // }

  const fontSize = option.fontSize || 16;
  const color = option.color || "#000";
  const backgroundColor =
    option.backgroundColor === undefined ? "#fff" : option.backgroundColor;

  const defaultPadding = 5;
  const paddingTop = option.paddingTop || defaultPadding;
  const paddingBottom = option.paddingBottom || defaultPadding;
  const paddingLeft = option.paddingLeft || defaultPadding;
  const paddingRight = option.paddingRight || defaultPadding;
  const border = option.border;
  const textOffset = option.textOffset || 0;

  const canvas = document.createElement("canvas"); // canvas 作为一个画布, 获取Canvas
  const ctx = canvas.getContext("2d"); // 获取一个  2D上下文,

  ctx.font = `${fontSize}px Helvetica`; // 文本字体
  const textInfo = ctx.measureText(text);

  canvas.width = textInfo.width + paddingLeft + paddingRight;
  canvas.height = fontSize + paddingTop + paddingBottom;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // 擦除(0,0)位置大小为 整个Canvas , 擦除的意思是把该区域变为透明

  // 背景
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (border && 1) {
    // 清空 上边框
    ctx.clearRect(0, 0, canvas.width, border.width);
    // 清空 左边框
    ctx.clearRect(0, 0, border.width, canvas.height);
    // 清空 右边框
    ctx.clearRect(
      canvas.width - border.width,
      0,
      border.width,
      canvas.height,
    );
    // 清空 下边框
    ctx.clearRect(
      0,
      canvas.height - border.width,
      canvas.width,
      border.width,
    );

    // 配置颜色 和 宽度
    ctx.strokeStyle = border.color;
    ctx.lineWidth = border.width;
    // 拐角
    ctx.lineJoin = "round";
    ctx.strokeRect(
      border.width / 2,
      border.width / 2,
      canvas.width - border.width,
      canvas.height - border.width,
    );
  }

  if (0) {
    // 下横线
    // ctx.lineWidth = 10;
    // ctx.strokeStyle = border.color;

    // ctx.strokeRect(
    //   canvas.width - paddingLeft,
    //   canvas.height - paddingTop,
    //   -(canvas.width - paddingRight * 2),
    //   -(canvas.height - paddingBottom * 2)
    // );

    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";

    ctx.strokeRect(
      paddingLeft,
      paddingTop,
      canvas.width - paddingRight * 2,
      canvas.height - paddingBottom * 2,
    );
  }

  if (text) {
    // 文字
    // ctx.shadowOffsetX = 2; // 影音 x
    // ctx.shadowOffsetY = 2; // 阴影 y
    // ctx.shadowBlur = 2; // 聚焦度 , 高度?
    // ctx.shadowColor = '#666666'; // 阴影颜色

    // 文字

    ctx.font = `${fontSize}px Helvetica`; // 文本字体
    ctx.textBaseline = "top";
    ctx.fillStyle = color; // 文本颜色

    ctx.fillText(text, paddingLeft, paddingTop + textOffset); // textBaseline.top 填充文本, 坐标
    // ctx.fillText(text, paddingLeft, canvas.height - paddingTop); // textBaseline.bottom 填充文本, 坐标
  }

  return canvas;
}

// var b64 = getTextCanvas("西山林语", {
//   fontSize: 36,
//   color: "#000000",
//   backgroundColor: "rgba(248,248,248,0.8)",
//   paddingRight: 14,
//   paddingLeft: 14,
//   paddingTop: 14,
//   paddingBottom: 14,
//   border: {
//     color: "#43aa37",
//     width: 4,
//   },
// }).toDataURL();


// 一维数组 线性插值
export function linearInterpolate(arr: number[]) {
  let result: number[] = [];
  let start = null;
  let end = null;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== undefined) {
      if (start === null) {
        start = { index: i, value: arr[i] };
      } else {
        end = { index: i, value: arr[i] };
        let steps = end.index - start.index;
        let increment = (end.value - start.value) / steps;

        for (let j = start.index; j <= end.index; j++) {
          result[j] = start.value + (j - start.index) * increment;
          result[j] = Math.round(result[j] * 100) / 100;
        }
        start = end;
        end = null;
      }
    }
  }
  return result;
}

// 行转列
export function transposeImageData(imageData: ImageData) {
  // 创建新的 ImageData 对象
  let newImageData = new ImageData(imageData.height, imageData.width);

  // 复制原始 imageData 数据
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      let index = (y * imageData.width + x) * 4;
      let newIndex = (x * imageData.height + y) * 4;
      newImageData.data[newIndex] = imageData.data[index];
      newImageData.data[newIndex + 1] = imageData.data[index + 1];
      newImageData.data[newIndex + 2] = imageData.data[index + 2];
      newImageData.data[newIndex + 3] = imageData.data[index + 3];
    }
  }

  return newImageData;
}

type Direction = "vertical" | "horizontal";

// 重复
export function repeatImageData(imageData: ImageData, n: number, direction: Direction) {

  // 计算新的宽度和高度
  let newWidth =
    direction === "vertical" ? imageData.width : imageData.width * n;
  let newHeight =
    direction === "horizontal" ? imageData.height : imageData.height * n;

  // 创建新的 ImageData 对象
  let newImageData = new ImageData(newWidth, newHeight);

  // 复制原始 imageData 数据
  if (direction === "vertical") {
    for (let i = 0; i < n; i++) {
      for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
          let index = (y * imageData.width + x) * 4;
          let newIndex =
            ((i * imageData.height + y) * imageData.width + x) * 4;
          newImageData.data[newIndex] = imageData.data[index];
          newImageData.data[newIndex + 1] = imageData.data[index + 1];
          newImageData.data[newIndex + 2] = imageData.data[index + 2];
          newImageData.data[newIndex + 3] = imageData.data[index + 3];
        }
      }
    }
  } else if (direction === "horizontal") {
    for (let y = 0; y < imageData.height; y++) {
      for (let i = 0; i < n; i++) {
        for (let x = 0; x < imageData.width; x++) {
          let index = (y * imageData.width + x) * 4;
          let newIndex =
            (y * imageData.width * n + i * imageData.width + x) * 4;
          newImageData.data[newIndex] = imageData.data[index];
          newImageData.data[newIndex + 1] = imageData.data[index + 1];
          newImageData.data[newIndex + 2] = imageData.data[index + 2];
          newImageData.data[newIndex + 3] = imageData.data[index + 3];
        }
      }
    }
  }

  return newImageData;
}

// 翻转
export function flipImageData(imageData: ImageData, direction: Direction) {

  // 创建新的 ImageData 对象
  let newImageData = new ImageData(imageData.width, imageData.height);

  // 复制原始 imageData 数据
  if (direction === "horizontal") {
    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        let index = (y * imageData.width + x) * 4;
        let newIndex =
          (y * imageData.width + (imageData.width - 1 - x)) * 4;
        newImageData.data[newIndex] = imageData.data[index];
        newImageData.data[newIndex + 1] = imageData.data[index + 1];
        newImageData.data[newIndex + 2] = imageData.data[index + 2];
        newImageData.data[newIndex + 3] = imageData.data[index + 3];
      }
    }
  } else if (direction === "vertical") {
    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        let index = (y * imageData.width + x) * 4;
        let newIndex =
          ((imageData.height - 1 - y) * imageData.width + x) * 4;
        newImageData.data[newIndex] = imageData.data[index];
        newImageData.data[newIndex + 1] = imageData.data[index + 1];
        newImageData.data[newIndex + 2] = imageData.data[index + 2];
        newImageData.data[newIndex + 3] = imageData.data[index + 3];
      }
    }
  }

  return newImageData;
}
