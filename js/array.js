
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

/* == 数组判断 */

if (data && data.length);

[] == false; // true
[0] == false; // true
[1] == false; // false

if ([]) 'true'; // true
if ([] == '') 'true'; // true
if ([] == '0') 'false'; // false
if ([] == 0) 'true'; // true
if ([] == 1) 'false'; // false

if ([] == undefined) 'false'; // false
if ([] == null) 'false'; // false

if ([] == false) 'true'; // true
if ([] == true) 'false'; // false

[] == []; //false
undefined == false; // false
undefined == true; // false
null == false; // false
null == true; // false
undefined == null; // true, 特殊

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
function arrayOverwriteRange(arr, insert, scpoe) {
  const remove = diff(scpoe, insert);
  arr = removeArrRange(arr, remove);
  arr = insertArrRange(arr, insert, scpoe);
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

// 交集2 A 有 且 B 有
function inter2(a, b) {
  let vmapcount = new Map();
  new Set(a).forEach((v) => {
    if (vmapcount.has(v)) vmapcount.set(v, vmapcount.get(v) + 1);
    else vmapcount.set(v, 1);
  });
  new Set(b).forEach((v) => {
    if (vmapcount.has(v)) vmapcount.set(v, vmapcount.get(v) + 1);
    else vmapcount.set(v, 1);
  });
  let res = [];
  vmapcount.forEach((count, v) => count > 1 && res.push(v));
  return res;
}

// 剔除
function removeArrRange(arr, remove, scpoe) {
  let _intersection = scpoe ? inter(remove, scpoe) : remove; // 交集
  return diff(arr, _intersection);
}
// 添加
function insertArrRange(arr, insert, scpoe) {
  let _intersection = scpoe ? inter(insert, scpoe) : insert; // 交集
  let _add = diff(_intersection, arr); // 差集
  return arr.concat(_add);
}


/**
 * 获取变化的数组
 * @param {[*]} pre 
 * @param {[*]} next 
 * @returns {{add:array,sub:array}} 增加的元素 add , 减少的元素 sub
 */
export function diffArr(pre, next) {
  let add = [], sub = [];
  let difference = next
    .concat(pre)
    .filter((v) => !next.includes(v) || !pre.includes(v)); // 对称差集
  sub = difference.filter((v) => pre.includes(v)); // difference - a  相对补集
  add = difference.filter((v) => !pre.includes(v)); // difference - (difference - a) 的 相对补集
  // console.log("对称差集", difference);
  // console.log("新增", add);
  // console.log("减少", sub);
  return { add, sub }
}

/**
 * 获取变化的数组
 * @param {[*]} pre
 * @param {[*]} next
 * @param {function} getValue
 * @returns {{add:array,sub:array}} 增加的元素 add , 减少的元素 sub
 */
 export function diffArrBy(pre, next, getValue) {
  let g = (e) => e;
  if (getValue instanceof Function) g = getValue;
  let add = [], sub = [];
  let difference = next
    .concat(pre)
    .filter((item) => !next.some(v => g(v) === g(item)) || !pre.some(v => g(v) === g(item))); // 对称差集
  sub = difference.filter((item) => pre.some(v => g(v) === g(item)) ); // difference - a  相对补集
  add = difference.filter((item) => !pre.some(v => g(v) === g(item))); // difference - (difference - a) 的 相对补集
  // console.log("对称差集", difference);
  // console.log("新增", add);
  // console.log("减少", sub);
  return { add, sub };
}