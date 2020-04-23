// 对象数组, 转对象

let arr = [
    {
        key: "key1",
        label: "2020-03-03测试图片1",
        count: 1
    },
    {
        key: "key2",
        label: "测试图谱1",
        count: 2

    },
    {
        key: "key3",
        label: "测试图谱2",
        count: 3
    }
]

// let a = go(arr, 'key', 'label');
// let a = go(arr, 'key', ['label', 'key']);
let a = go(arr, 'key', 'label');
console.log(a);

/**
 * 
 * @param {[{}]} arr  对像数组
 * @param {string} key  键
 * @param {string | [string]} keys 
 * @param {boolean} flag   限制 keys 为 数组时, 保留或剔除的标志
 */
function go(arr, k, keys, flag = false) {
    let object = {}
    if (typeof (keys) == 'string') {
        return arr.reduce((acc, item, index, _) => {
            acc[item.key] = item.label
            return acc
        }, {})
    }
    arr.forEach(item => {
        let key = item[k];
        let value = {};
        if (flag == true) {
            // 排除 keys
            Object.keys(item).forEach(key => {
                if (keys.includes(key) == false)
                    value[key] = item[key]
            })
        } else {
            // 保留 keys
            keys.forEach(key => {
                value[key] = item[key]
            })
        }
        object[key] = value;
    })
    return object;
}
