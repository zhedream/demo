/**
 * @description 数组分页
 * @param {*} pageNo 页码
 * @param {*} pageSize 条数
 * @param {*} array 数组
 */
export const paginationFromArr = (pageNo, pageSize, array) => {
    const offset = (pageNo - 1) * pageSize;
    return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
}

// 数组去重
let obj = {};
arr = arr.reduce(function (item, next) {
    obj[next.PollutantCode] ? '' : obj[next.PollutantCode] = true && item.push(next);
    return item;
}, []);


// 保留三字 + ..
export const textDot = (value) => {
    // 显示字数 三个字
    if (value.length > 3) return value.slice(0, 3) + "..";
    else return value;
}
/**
 * 中文长度
 * @param {string} str 
 * @return {number}
 */
export const mbLen = (str) => {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        var a = str.charAt(i);
        if (a.match(/[^\x00-\xff]/gi) != null) {
            len += 2;
        } else {
            len += 1;
        }
    }
    return len;
}