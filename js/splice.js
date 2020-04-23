// splice() 方法通过删除或替换现有元素或者原地添加新的元素来修改数组,并以数组形式返回被修改的内容。此方法会改变原数组。
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice

let arr = [0,1,2,3,4,5];
let removeArr = arr.splice(3,arr.length -3,...['a','b']) // [index,长度]
console.log(arr);
console.log(removeArr);
