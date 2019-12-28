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

console.log(a);
