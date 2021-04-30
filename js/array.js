
let arr = [1, 2, 3, 4, 5];

arr.splice(3, 1)

console.log(arr);


arr.some(item => item === 1); // true 满足一项为真 true | false
arr.every(item => item === 1); // false 满足所有为真 true | false

// 删除/替换/插入 数组
let remove = arr.splice(1, 3); // [index,length,insert]:移除的

// 数组截取, 浅拷贝 [1,3)
arr.slice(1, 3);
arr.slice(index, index + 3);

arr.slice(-1)[0]; // last item
arr.includes() // Boolean
// console.log(arr);

arr.push(6, 7, 8)

// arr.filter((value, index, data) => value); // 去假值
arr.filter(v => v); // 去假值

// 表格数据 筛选与去重 , 聚合函数, 把元素处理, 返回一个结果
let tasks = [];
let CarNumbers = tasks.reduce(
  // 逗号操作符 acc.add 后 return acc
  (acc, item) => (acc.add(item.CarNumber), acc),
  new Set()
);
CarNumbers = Array.from(CarNumbers)

// console.log(arr.join(''));

let aaa = arr.find((item, index) => item === 8) // item or undefined
aaa = arr.findIndex((item, index) => item === 8) // index or -1
aaa = arr.indexOf(4) // index or -1

console.log(aaa);

// 对 伪数组 或 可迭代对象 转换成 数组(浅拷贝)
// Array.from()
//  [...] 
function toArray(linkArr) {
  return [].slice.call(linkArr);
}
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from

/* == 清空数组 */
// - js 清空数组的方法 https://www.cnblogs.com/jichi/p/10516576.html
arr.length = 0;
arr.splice(0, arr.length, ...[]);
arr = [];



/*

let a = [1, 2, 3] // 新数组
let b = [2, 4, 5] // 原数组

// 并集
let union = a.concat(b.filter(v => !a.includes(v))) // [1,2,3,4,5]
// 交集
let intersection = a.filter(v => b.includes(v)) // [2]
// 差集
let difference = a.concat(b).filter(v => !a.includes(v) || !b.includes(v)) // [1,3,4,5]
// 相对补集
let sub = difference.filter(v => b.includes(v)); // [3]
let add = difference.filter(v => !b.includes(v)); // [4,5]

1. JS数组求并集，交集和差集
https://excaliburhan.com/post/js-set-operation.html
2. 交集、差集、并集的图文说明
https://jingyan.baidu.com/article/22fe7ced4e36bd7002617fae.html

*/


// 在一个数组范围 安全设置数组, 保留原顺序
function arrayOverwriteRange(arr, insert, range) {
  const remove = diff(range, insert);
  arr = removeArrRange(arr, remove);
  arr = insertArrRange(arr, insert, range);
  return arr;
}

// 差集 , A 有 B 没有
function diff(arr, arr2) {
  return arr.filter(v => arr2.indexOf(v) == -1);
}
// 交集 A 有 且 B 有
function inter(a, b) {
  return a.filter(v => b.indexOf(v) > -1);
}

// 剔除
function removeArrRange(arr, remove, range) {
  let _intersection = range ? inter(remove, range) : remove; // 交集
  return diff(arr, _intersection);
}
// 添加
function insertArrRange(arr, insert, range) {
  let _intersection = range ? inter(insert, range) : insert; // 交集
  let _add = diff(_intersection, arr); // 差集
  return arr.push(..._add), arr;
}