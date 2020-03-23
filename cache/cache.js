let MemoryCahce = new Map();

/**
 * 对同步函数结果缓存
 * @param {Function} fn 目标函数
 * @param {any | Array} data 函数参数, 多参数需要传递数组
 * @param {string} flag 附加 key 标识
 * @param {string} group 附加 组别 标识
 * @param {*} ttl 过期时间, -1 不过期
 */
const cacheSync = function (fn, data, flag = '', group = '', ttl = -1) {
    // 唯一标识
    const key = fn.name + JSON.stringify(data) + flag;
    // 取缓存
    if (MemoryCahce.has(key)) return MemoryCahce.get(key).data;
    // 处理参数:多个参数需要传递数组
    let params;
    if (data instanceof Array) params = data
    else params = [data]
    // 执行
    const res = fn.call(this, ...params);
    MemoryCahce.set(key, {
        startTime: new Date(),
        endTime: -1,
        data: res,
        group
    })
    return res;
}

/**
 * 对异步函数结果缓存
 * @param {Function} fn 目标函数 async
 * @param {any | Array} data 函数参数, 多需要传递数组
 * @param {string} flag 附加 key 标识
 * @param {string} group 附加 组别 标识
 * @param {*} ttl 过期时间, -1 不过期
 */
const cacheAsync = function (fn, data, flag = '', group = '', ttl = -1) {
    // 1. 唯一标识
    const key = flag !== "" ? flag : JSON.stringify(data);
    if (MemoryCahce.has(key)) {
        console.log(key + '取缓存');
        return new Promise(resolve => resolve(MemoryCahce.get(key).data))
    }

    let params;
    if (data instanceof Array) params = data
    else params = [data]

    return fn.call(this, ...params).then(data => {
        console.log('已缓存', key);
        console.log('数据', JSON.stringify(data));
        MemoryCahce.set(key, {
            startTime: new Date(),
            endTime: -1,
            data,
            group
        })
        return data;
    })
}


setInterval(() => {
    console.log('检查过期数据');
    MemoryCahce.forEach((item, key) => null)
}, 10000)