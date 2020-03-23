
let arr = [1, 2, 3, 4, 5];

// 删除/替换/插入 数组
let remove = arr.splice(1, 3); // [index,length,insert]:移除的

// 数组截取, 浅拷贝 [1,3)
arr.slice(1, 3);


console.log(arr);

arr.push(6, 7, 8)

console.log(arr.join(''));


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