
/* 
reduce() 方法对数组中的每个元素执行一个由您提供的reducer函数(升序执行)，将其结果汇总为单个返回值。
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce

arr.reduce(callback,initialValue)

callback
    Accumulator (acc) (累计器)
    Current Value (cur) (当前值)
    Current Index (idx) (当前索引)
    Source Array (src) (源数组)
initialValue . Accumulator 的初始值

*/

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


let a = arr.reduce((acc, item, index, _) => {
    acc[item.key] = item.label
    return acc
}, {})
console.log(a);
