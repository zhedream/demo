//时间格式化
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1, //month
    "d+": this.getDate(), //day
    "h+": this.getHours(), //hour
    "m+": this.getMinutes(), //minute
    "s+": this.getSeconds(), //second
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
    S: this.getMilliseconds(), //millisecond
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

/**
 * 安全格式化时间
 * @param {Date} timeStr 时间,Date,时间戳
 * @param {*} fmt 格式
 * @returns {string} 格式化后的时间字符串
 */
function timeFormatSafe(timeStr, fmt) {
  fmt = fmt || "yyyy-MM-dd hh:mm:ss";
  if (!timeStr) return "";
  if (typeof timeStr == 'string') timeStr = timeStr.replace(/-/g, '/'); // 2021-01 => 2020/01
  let t = new Date(timeStr);
  if (t == "Invalid Date") return "";
  return t.format(fmt);
}

// var t = timeFormatSafe(Date.now());
// var t = timeFormatSafe(Date.now(),'yyyy-MM-dd hh:mm:ss');
var t = timeFormatSafe('2021-03-23 17:22:46', 'yyyy-MM-dd hh:59:59');

console.log('t: ', t);

/* 
  时间戳 (毫秒)
*/
Date.now(); // 当前时间戳
new Date('2021-01-02 18:23').getTime(); // 获取时间戳


/* 
  获取某个月最后一天
  */
// https://blog.csdn.net/A_Runner/article/details/80332559

new Date('2020', '02', 0).getDate(); // 获取 2020-02 最后一天

function getMonthLastDate(date) {
  date = date || Date.now();
  return new Date(timeFormatSafe(date, 'yyyy-MM').split('-'), 0).getDate()
}



/* 
  判断 闰年
*/

function isLeap(year) {
  return year % 100 != 0 && year % 4 == 0 || year % 400 == 0;
}

/* 
  获取某个月的上一个月
*/

date = new Date(date);
date2 = date.setMonth(date.getMonth() - 1);

function getDate(index) {
  var date = new Date();
  //当前日期
  var newDate = new Date();
  newDate.setDate(date.getDate() + index);
  //官方文档上虽然说setDate参数是1-31,其实是可以设置负数的
  var time = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate();
  return time;
}


/* 
  月份
*/

function changeMonth(time, num) {
  if (typeof time == 'string') time = time.replace(/-/g, '/'); // 2021-01 => 2020/01
  time = new Date(time);
  time = time.setMonth(time.getMonth() + num);
  time = timeFormatSafe(time, 'yyyy-MM-dd hh:mm:ss');
  return time;
}


/*
  js new Date 创建时间默认是8点
  https://blog.csdn.net/qq_31725391/article/details/103654706
*/

new Date('2021-02'); // => 2021-02-01 08:00:00
new Date('2021/02'); // => 2021-02-01 00:00:00