// 官网 https://lodash.com/
// 中文网 https://www.lodashjs.com/

// import { groupBy } from 'lodash'
var _ = require('lodash')

let arr = [
    '11-22',
    '11-12',
    '22-arr',
    '22-arr',
    '11-s',
    '33-3',
    '11-1',
]

let tem = _.groupBy(arr, (item) => {
    return item.substring(0, 2);
})
let a = []
for (let [key, val] of Object.entries(tem)) {
    a.push({ date: key, times: val });
}


// 矩阵转置 行转列

var arr = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
console.log('arr1', arr);

arr = _.unzip(arr);
console.log('arr2', arr);

arr = _.flatten(arr);
console.log('arr3', arr);

arr = _.chunk(arr, 3);
console.log('arr4', arr);


