
// 字符串分割
let str = '1,2,3,4'
console.log(str.split(',')[2]);

// 字符串截取 [0,1) , 不包含 1 
str.substring(0, 1);

str.includes(',2'); // 是否包含 字符串

// 字符串 .. 处理
const sub = function (str) {
    // 显示字数 三个字
    if (str.length > 3) return str.slice(0, 3) + "..";
    else return value;
}