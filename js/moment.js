// 中文官网: http://momentjs.cn/docs/
// npm i moment -S
var moment = require('moment'); // 处理时间的包

// moment()  创建一个 moment 对象实例, 默认当前时间

moment().format('YYYY-MM-DD HH:mm:ss') // 格式化时间
moment().format('YYYY-MM-DD HH:00') // 格式化当前时间 为 整点时间, 分 00 补位
moment().format('YYYY-MM-DD HH:00:00') // 格式化当前时间 整点时间, 分 秒 00 补位

console.log('一小时之前', moment().subtract(1, 'hours').format('YYYY-MM-DD HH:00')); // 一小时之前
console.log('一小时之后', moment().add(1, 'hours').format('YYYY-MM-DD HH:00:00')); // 一小时之后, 保留小时分秒 补 00

new Date().getTime() // 获取时间戳

moment().date(); // 这个月几号

moment().format('d') // 周几 [0,6]  周日第一天为 0  

moment().isBefore('2020-01-05'); // false 某天之前
moment() < moment('2020-01-05') // false 
moment() < moment('2020-01-05').endOf('day') // false 

// 前一天日期
let day = new Date();
day.setDate(day.getDate() - 1)
console.log(day.format("yyyy-MM-dd")); // es6 没有 format 方法

// 一小时之前
new Date(
    new Date().setTime(new Date().getTime() - 1000 * 60 * 60 * 1 * 1)
)

