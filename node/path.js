const path = require("path");

console.log(__dirname); // 魔术变量  当前文件夹

console.log(__filename); // 魔术变量 当前文件 绝对路径

const filename = path.basename(__filename);
console.log(filename); // path.js

// const a = path.resolve("/aa/ac", "../d3", "./2/day2/"); // 解析成绝对路径
const a = path.resolve("./aa/ac", "../d3", "./2/day2/"); // 解析成绝对路径

const b = path.relative(__dirname, a); // 解析成相对路径

console.log(a);

console.log(b);
