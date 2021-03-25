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
function timeFormatSage(timeStr, fmt) {
  fmt = fmt || "yyyy-MM-dd hh:mm:ss";
  if (!timeStr) return "";
  let t = new Date(timeStr);
  if (t == "Invalid Date") return "";
  return t.format(fmt);
}

// var t = timeFormatSage(Date.now());
// var t = timeFormatSage(Date.now(),'yyyy-MM-dd hh:mm:ss');
var t = timeFormatSage('2021-03-23 17:22:46', 'yyyy-MM-dd hh:59:59');

console.log('t: ', t);


Date.now(); // 当前时间戳
new Date('2021-01-02 18:23').getTime(); // 获取时间戳


