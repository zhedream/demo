// 参考
// https://www.vicw.com/groups/code_monkey/topics/229

// rgbToHex(0, 51, 255) => "#0033ff"
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

//hexToRgb("#0033ff") => {r: 0, g: 51, b: 255}
//hexToRgb("#0033ff").g => 51
function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

//灰度 = 红×0.299 + 绿×0.587 + 蓝×0.114
function getGrayLevelFromRgb(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

// getGrayLevel('#167df0') => 0.4208352941176471
function getGrayLevel(hex) {
  var rgb = hexToRgb(hex);
  return getGrayLevelFromRgb(rgb.r, rgb.g, rgb.b);
}

function getColor(background_color) {
  var grayLevel = getGrayLevel(background_color);
  return grayLevel > 0.5 ? "#000000b3" : "#fff";
}
// https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

function contrastColor(color) {
  const lum = [1, 3, 5]
    .map(
      (
        pos //get RGB colors array from the string at positions 1, 3 and 5 (0 = # character)
      ) => {
        // return converted hex value into decimal for each R, G, and B
        return parseInt(color.substr(pos, 2), 16);
      }
    )
    .reduce((result, value, index) => {
      // with reduce() we can convert an array of numbers into a single number
      // result = previous result returned by this function
      // value = Red, Green or Blue value of the color
      // index = current position index in the array
      // y = https://www.w3.org/TR/AERT/#color-contrast

      const y = [0.299 /*red*/, 0.587 /*green*/, 0.114 /*blue*/][index];
      return result + y * value; // return sum of previous results
    }, 0 /* result = 0 */);

  const isDark = lum < 128;
  const index = ~~isDark; // convert boolean into 0 or 1
  return ["black", "white"][index];
}
