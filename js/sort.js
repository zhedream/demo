// JS sort 排序
// LINK: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

var array1 = [1, 2, 30, 4, , 800, 9, 21, 100000];

console.log('a' < 'b'); // true
console.log('a' - 'b'); // NaN
console.log('80' > '9'); // false
console.log('80' - '9'); // 71

array1.sort((a, b) => a < b);
console.log(array1);
/* 

默认  Unicode升序, '1' - '30' a < b 不交换

返回 负数 | -1 或 1 | 正数

*/


array1.sort((a, b) => {
    typeof a;
    var nameA = a; // 按需 忽略 字符大小 toUpperCase()
    var nameB = b;
    if (nameA > nameB) {
        return -1; // 降序
    }
    if (nameA < nameB) {
        return 1;
    }
    return 0; // 相等
});

// console.log(array1);



array1.sort((a, b) => a - b); // 升序
// console.log(array1);
array1.sort((a, b) => b - a); // 降序
// console.log(array1);

// Unicode 排序
array1.sort((a, b) => a < b);
// console.log(array1);
array1.sort((a, b) => a > b);
// console.log(array1);

/*

1. 引用
2. Unicode 排序 ,  "80" 要比 "9" 要靠前。
2. a < b 返回 -1 ,  a > b 返回 -1 ,默认返回0 ,

*/