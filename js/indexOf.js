let exceptpoints = ["23", "24", "25"];

if (exceptpoints.indexOf('23') < 0)
    console.log('true: 未找到'); // indexOf 没找到返回 -1
else
    console.log('false: 找到'); // 找到 返回 索引
