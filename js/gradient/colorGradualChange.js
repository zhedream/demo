/**
 * 颜色渐变集合
 * @param {string} startColor 开始颜色, HEX OR RGB
 * @param {string} endColor 结束颜色
 * @param {number} step 色阶, 越大颜色过度越平滑
 * @return {[[number,number,number]]} 颜色集合 [[r,g,b]]
 */
export function colorGradualChange(startColor, endColor, step) {
    var rgb = /^rgb|RGB\((([0-9]|[1-9]\d|1\d\d|2([0-4]\d|5[0-5])),){2}([0-9]|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\)$/;    //rgb
    var hex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i; //16进制
    //颜色预处理
    var startRGB, endRGB;
    if (hex.test(startColor)) {
        startRGB = fAnalysisRGB(startColor);
    } else if (rgb.test(startColor)) {
        startRGB = startColor.substring(3, 15).split(',');
    }
    if (hex.test(endColor)) {
        endRGB = fAnalysisRGB(endColor);
    } else if (rgb.test(startColor)) {
        endRGB = endColor.substring(3, 15).split(',');
    }
    var startR = startRGB[0], startG = startRGB[1], startB = startRGB[2];
    var endR = endRGB[0], endG = endRGB[1], endB = endRGB[2];

    var sR = (endR - startR) / step;
    var sG = (endG - startG) / step;
    var sB = (endB - startB) / step;

    var colors = [];
    for (var i = 0; i < step; i++) {
        // colors.push(fColorToHex(parseInt((sR * i + startR)), parseInt((sG * i + startG)), parseInt((sB * i + startB))));
        colors.push([parseInt((sR * i + startR)), parseInt((sG * i + startG)), parseInt((sB * i + startB))]);
    }
    return colors;
};
/**
 * 解析rgb格式
 * @param {string} color 
 * @return {[number,number,number]} 颜色集合 [r,g,b]
 */
function fAnalysisRGB(color) {
    var color = color.toLowerCase().substring(1, color.length);
    var colors = [];
    colors.push(parseInt(color.substring(0, 2), 16))
    colors.push(parseInt(color.substring(2, 4), 16))
    colors.push(parseInt(color.substring(4, 6), 16))
    return colors;
}

/**
 * rgb转hex
 * @param {number} r 
 * @param {number} g 
 * @param {number} b 
 * @return {string} 十六进制颜色,如 #2860fd
 */
export function fColorToHex(r, g, b) {
    var hex = "#" + fAddZero(r.toString(16)) + fAddZero(g.toString(16)) + fAddZero(b.toString(16));
    return hex;
}

/**
 *   加0补位
 */
function fAddZero(v) {
    var newv = "00" + v;
    return newv.substring(newv.length - 2, newv.length);
}
