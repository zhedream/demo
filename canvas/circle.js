/* 
Math.PI和Math.sin() 与 Math.cos()搭配使用详解
https://www.cnblogs.com/xiejn/p/11901019.html



*/

// 3 点 顺时针
function getxy1(a, b, r, 弧度) {
  var X坐标 = a + Math.cos(弧度) * r
  var Y坐标 = b + Math.sin(弧度) * r
  return [X坐标, Y坐标]
}

// 3 点 逆时针
function getxy2(x, y, r, 弧度) {
  var X坐标 = y + Math.cos(弧度) * r;
  var Y坐标 = x - Math.sin(弧度) * r;
  return [X坐标, Y坐标]
}

// 12 点 顺时针
function getxy3(x, y, r, 弧度) {
  var X坐标 = x + Math.sin(弧度) * r;
  var Y坐标 = y - Math.cos(弧度) * r;
  return [X坐标, Y坐标]
}

function 计算弦长(r, 弧度) {
  return r * Math.sin(弧度 / 2) * 2;
}

function 计算拱高(r, 弧度) {
  return r * Math.cos(弧度 / 2);
}

/**
 * 弧度转角度
 * @param radian 
 * @returns 
 */
function toAngle(radian) {
  // while (radian < 0) radian += 2 * Math.PI;
  return loopNumber(radian, 2 * Math.PI) * 180 / Math.PI;
}
/**
 * 角度转弧度
 * @param angle 
 */
function toRadian(angle) {
  // while (angle < 0) angle += 360;
  return loopNumber(angle, 360) * Math.PI / 180;
}

/**
 * 数循环
 * @param {*} num 
 * @param {*} fullNum 
 */
function loopNumber(num, fullNum) {
  // 0:0   1:1  360:360  361:1
  const rest = num % fullNum; // 余数
  const multiple = parseInt(num / fullNum); // 倍数
  if (rest == 0) {
    const isFull = multiple % 2 != 0;
    if (isFull) return fullNum;
    return 0;
  }
  return rest
}

console.log(
  loopNumber(-366, 360)
);

// console.log(
//   toAngle(Math.PI * (1 / 3))
// );


// console.log(
//   toRadian(180 * 4)
// );


// console.log(
//   getxy(0, 0, 1, toRadian(270))
// );