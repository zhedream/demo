
let o = {

}

function go(item, keys, flag) {
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
}