// filter() 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。 
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

let a = ['',' ',0,,'0',null,undefined,1,2]
let b = a.filter(e=>e); // 过滤假值
console.log(b);
