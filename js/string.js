
// 字符串分割
let str = '1,2,3,4'

console.log(str.substring(3, undefined));

let ext = 'can.al'


console.log(ext.split('can')) // ['','.al']

console.log(ext.lastIndexOf('a', 5)); // searchValue, <=index | index为正数

console.log(str.substring(0, -2)); // [indexStart,indexEnd) | indexEnd为正数

console.log(str.slice(0, -2)); // [start,end)  [0,1,2, ... ] OR [... -3,-2,-1]

console.log(str.substr(0, 3)); // [index,length]


// console.log(str.split(',')[2]);

// 字符串截取 [0,1) , 不包含 1 
str.substring(0, 1);

str.includes(',2'); // 是否包含 字符串 true | false

// 字符串 .. 处理
const sub = function (str) {
    // 显示字数 三个字
    if (str.length > 3) return str.slice(0, 3) + "..";
    else return value;
}

const getExt = function (str) {
    return str.substr(str.lastIndexOf('.'))
}

/*

1. JS - 字符串截取方法汇总（slice、substring、substr等）
https://www.hangge.com/blog/cache/detail_1887.html
*/