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


// 前一天日期
let day = new Date();
day.setDate(day.getDate() - 1)
console.log(day.format("yyyy-MM-dd"));

