/**
 * @description 数组分页
 * @param {*} pageNo 页码
 * @param {*} pageSize 条数
 * @param {*} array 数组
 */
export const paginationFromArray = (pageNo, pageSize, array) => {
    if (!array) return array;
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

/**
 * 去掉首尾两端的空格
 * @param {*} str 
 */
export function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}


/**
 * 返回第几列
 * @param {*} count 当前第几个
 * @param {*} columnCount 一行几个
 * @return {number} 1 <= curColumn <= columnCount
 */
export function whichColumn(count, columnCount) {
    const remainder = (count - 1) % columnCount; // 下标的余数
    const restCount = columnCount - remainder - 1; // 剩余的个数
    return columnCount - restCount; // 第几个
}


/**
 * 获取数据类型
 * @param {*} value 
 * @return {string} String Array Object Boolean 等
 */
const _toString = Object.prototype.toString;
export const toRowTYpe = function toRowType(value) {
    _toString.call(value).slice(8, -1)
}

/**
 * 复制内容
 * @param {string} content
 * @returns {Boolean}
 */
export function copy(content) {
    // input 不能换行
    // textarea 支持 \n 换行复制
    // 复制 dom.innerText
    let temp = document.createElement("textarea");
    temp.value = content;
    document.body.appendChild(temp);
    temp.select();
    let flag = document.execCommand("Copy");
    temp.remove();
    return flag;
}

function getDom(selector) {
    if (selector instanceof HTMLElement)
        return selector;
    return document.querySelector(selector)
}

/**
 * 
 * @param {*} element 
 * @returns 
 */
function getElementLeft(element) {
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    console.log('current: ', current);

    while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    return actualLeft;
}

function getElementTop(element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
}

// 生成随机字符

Math.random().toString(36).substr(2);

URL.createObjectURL(new Blob()).substr(-36)


/**
 * 获取行,所在页码
 * @param {*} dataIndex 数据行
 * @param {*} pageSize 数量
 * @returns [number,number] 页码 第几个
 */
function getDataIndex(dataIndex, pageSize) {
    if (dataIndex == 0) return [0, 0]
    let page = 0;
    let count = 0;
    if (dataIndex % pageSize == 0) {
        page = dataIndex / pageSize
        count = pageSize
    } else {
        page = parseInt(dataIndex / pageSize) + 1
        count = dataIndex % pageSize
    }
    return [page, count]
}

/**
 * 下载文件
 * @param {*} url 
 */
function downLoadUrl(url) {
    let link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    let event = new MouseEvent('click');
    link.dispatchEvent(event);
    link.remove();
    link = null;
}

/**
 * 获取后缀
 * @param {*} name 
 * @returns string
 * @description getExt('a.jpg') => 'jpg'
 */
function getExt(name) {
    let ext = name.split('.');
    return ext[ext.length - 1];
}