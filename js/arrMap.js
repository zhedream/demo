arr = [
    { key: 'a' },
    { key: 'b' },
    { key: 'c' },
    { key: 'd' },
    { key: 'e' },
]
let arrMap = arr.reduce((pre, item, index, ) => {
    pre[item.key] = index
    return pre
}, {})

console.log(arrMap);

let headerMap = {};
arr.forEach((item, index) => headerMap[item.key] = index)
console.log(headerMap);
