
/* 

JS sort 排序
LINK: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

默认  Unicode升序

如果 compareFunction(a, b) 小于 0 ，那么 a 会被排列到 b 之前；
如果 compareFunction(a, b) 等于 0 ， a 和 b 的相对位置不变。备注： ECMAScript 标准并不保证这一行为
如果 compareFunction(a, b) 大于 0 ， b 会被排列到 a 之前。

自定义函数 要求返回 负数 | 正数 如 -1 | 1  

*/

var array1 = [1, 2, 30, 4, , 800, 9, 21, 100000];


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

console.log(array1);


// Number 排序
array1.sort((a, b) => a - b); // 升序
// console.log(array1);
array1.sort((a, b) => b - a); // 降序
// console.log(array1);

// Unicode 排序
array1.sort((a, b) => String(a).toUpperCase() > String(b).toUpperCase() ? 1 : -1); // 升序
array1.sort((a, b) => String(a).toUpperCase() < String(b).toUpperCase() ? 1 : -1); // 降序
console.log(array1);



// TODO: 数组对象排序,多字段 
function s(arr, option) { }
s(arr, { name: 'desc', age: 'asc', })

/*

1. 引用
2. Unicode 排序 ,  "80" 要比 "9" 要靠前。
2. a < b 返回 -1 ,  a > b 返回 -1 ,默认返回0 ,

*/