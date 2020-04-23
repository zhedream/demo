arr = [
    { key: 'a' },
    { key: 'b' },
    { key: 'c' },
    { key: 'd' },
    { key: 'e' },
]
let arrMap = arr.reduce((acc, item, index, _) => {
    acc[item.key] = index
    return acc
}, {})

console.log(arrMap);

let headerMap = {};
arr.forEach((item, index) => headerMap[item.key] = index)
console.log(headerMap);
