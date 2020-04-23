
// slice() 方法返回一个新的数组对象，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包括 begin，不包括end）。原始数组不会被改变。
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice

let arr = [0,1,2,3,4,5];
arr = arr.slice(1,1); // [index,index+1) . 
console.log(arr);
