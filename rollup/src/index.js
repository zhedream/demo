import {sum} from "./sum";
import {hello, sum2} from "./hello";

// 并不会把 所有,代码打包到 bundle.js 中
import "./createRemoveSpace";

// 不能互能混用 ES6 和 CommonJS 模块语法不能混用
// ES6 模块语法,优先级高于 CommonJS 模块语法
// 存在 ES6 模块语法, require 会被当成普通代码

// let {hello: aa} = require("./hello.js");
// aa();

// 可以使用 require 引入 ES6 模块语法
// 也可以使用 import 引入 CommonJS 模块语法

// JS 可以使用 ES6 模块语法,也可以使用 CommonJS 模块语法
// TS 只能使用 ES6 模块语法

// 推荐使用 ES6 模块语法, 有静态分析的能力,可以做到 tree shaking

console.log(sum(1, 5));

console.log(sum2(2, 1));

console.log("Index.js");

hello();

