
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

// 以 .. 开始
str.startsWith('ca');

// 字符串 .. 处理
const sub = function (str) {
    // 显示字数 三个字
    if (str.length > 3) return str.slice(0, 3) + "..";
    else return value;
}

const getExt = function (str) {
    return str.substr(str.lastIndexOf('.'))
}




// 正则替换
var regex = /rgba\((.+),(.+),(.+),(.+)\)/;
var str = `color:rgba(0.2, 130, 101, 0.2);`

var m = str.match(regex);
var temp = `rgba($1,$2,${m[3]}, 1)`;
/* 
占位符 变量
$& : 匹配到的
$` : 匹配的左边
$' : 匹配的右边
$n : 第 1-100 个括号匹配的字符串
*/
// var c = str.replace(regex, "❤ $& ❤");
var c = str.replace(regex, temp);
// var c = str.replace('130', '140');


console.log(regex);
console.log(m);
console.log(c);

// 替换2
var key = '11';
var ins = '<span style="color:red;">11</span>';
var str = `(港) aqms-1100-2020110015`;
var c = str.replace('11', ins)
var c = str.split(key).join('#;#' + ins).split('#;#').join()
console.log(c);


// 进制转换

var num = 11;
var s32 = num.toString(32); // 转其他进制: 转成 32 进制
var int10 = parseInt(s32, 32); // 转10进制: 待转换, 带转换进制
console.log('int10: ', int10);
var radixto = (s, a, b) => parseInt(s, a).toString(b)

// slice()、substring()、substr()

/*

slice() // [begin ,end) 浅拷贝, 索引可负数 , 超出索引范围为 默认为 0
substr()  //   [index,length] , 索引可负数 , MDN 不推荐 未来将可能会被移除掉,
substring() // [begin,end) , 索引非负数 , 索引可交换 , #注意: [index, 超出] -> [0,index]

*/

/*

1. JS - 字符串截取方法汇总（slice、substring、substr等）
https://www.hangge.com/blog/cache/detail_1887.html
*/