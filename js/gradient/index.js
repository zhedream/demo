import { colorGradualChange, fColorToHex } from './colorGradualChange'

var allColorList = [];

allColorList = colorGradualChange("#2860fd", "#4ad8f5", 25);
allColorList = allColorList.concat(
  colorGradualChange("#4ad8f5", "#4ff800", 25)
);
allColorList = allColorList.concat(
  colorGradualChange("#4ff800", "#ffff00", 25)
);
allColorList = allColorList.concat(
  colorGradualChange("#ffff00", "#ff0000", 25)
);

// 转 16 进制颜色
allColorList.forEach((item, index, data) => {
  let hex = fColorToHex(...item);
  data[index] = hex;
})

let val = 15; // 值
let min = 5; // 最小值 , #2860fd
let max = 105; // 最大值 , #ff0000


let color = getColor(min, max, val)

console.log(color)

function getColor(min, max, val) {

  const stopCount = allColorList.length; // 80个色阶, 80种过度颜色

  if (val < min) {
    return allColorList[0];
  } else if (val > max) {
    return allColorList[allColorList.length - 1]
  }
  let percent = (val - min) / (max - min); // 

  let color = allColorList[
    parseInt(percent * stopCount)
  ];

  return color

}

window.getColor = getColor;
