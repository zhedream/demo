// 中文官网: http://momentjs.cn/docs/

// 同类库 dayjs date-fns
// https://juejin.im/post/5b9f4df66fb9a05d2e1b8f02 moment对比

// npm i moment -S
var moment = require('moment'); // 处理时间的包


moment().get('D') // 本月 第几天
moment().get('d') // 本周 第几天, 周日-周一 : 0-6
moment().daysInMonth() // 本月有几天
moment().month()
// moment()  创建一个 moment 对象实例, 默认当前时间

moment().format('YYYY-MM-DD HH:mm:ss') // 格式化时间
moment().format('YYYY-MM-DD HH:00') // 格式化当前时间 为 整点时间, 分 00 补位
moment().format('YYYY-MM-DD HH:00:00') // 格式化当前时间 整点时间, 分 秒 00 补位

console.log('一小时之前', moment().subtract(1, 'hours').format('YYYY-MM-DD HH:00')); // 一小时之前
console.log('一小时之后', moment().add(1, 'hours').format('YYYY-MM-DD HH:00:00')); // 一小时之后, 保留小时分秒 补 00

new Date().getTime() // 获取时间戳

moment().date(); // 这个月几号

moment().format('d') // 周几 [0,6]  周日第一天为 0  

moment().isBetween()
moment().isAfter()

moment().isBefore('2020-01-05'); // false 某天之前
moment() < moment('2020-01-05') // false 
moment() < moment('2020-01-05').endOf('day') // false 

Date.prototype.format = function (format) {
  return moment(this).format(format).toString();
}
// 前一天日期
let day = new Date();
day.setDate(day.getDate() - 1)
console.log(day.format("YYYY-MM-DD")); // es6 没有 format 方法

// 一小时之前
new Date(
  new Date().setTime(new Date().getTime() - 1000 * 60 * 60 * 1 * 1)
)

// Data.format
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1, //month
    "d+": this.getDate(), //day
    "h+": this.getHours(), //hour
    "m+": this.getMinutes(), //minute
    "s+": this.getSeconds(), //second
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
    S: this.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return format;
};

// 时间戳
Date.now();
new Date('2020-04-24 10:50:20').getTime(); // 1587696620000
moment('2020-04-24 10:50:20').valueOf(); // 1587696620000

/* ==== 时间交集 ===== */

// time 1   10:00 - 13:00
let s1 = new Date('2020-04-24 10:00:00').getTime();
let e1 = new Date('2020-04-24 13:00:00').getTime();
// time 2   09:00 - 12:00
let s2 = new Date('2020-04-24 09:00:00').getTime();
let e2 = new Date('2020-04-24 12:00:00').getTime();
if (e1 < s2 || s1 > e2) return; // 无交集
// 交集部分
const s = s1 > s2 ? s1 : s2;
const e = e1 < e2 ? e1 : e2;

/* ==== 时长 ===== */

const t1 = new Date('2020-06-19 11:56:13').getTime();
const t2 = new Date('2020-06-20 12:58:20').getTime();
// moment.duration(100); // 时长 默认毫秒, duration(100,'seconds'); // 秒
const duration1 = moment.duration(t2 - t1).minutes(); // '0000:00:01 01:02:07' ->  获取分钟数 2 min
const duration2 = moment.duration(t2 - t1).asMinutes() | 0; // 一般使用这个, 总共时差, `| 0` 位运算 取整
console.log(duration1, duration2);
