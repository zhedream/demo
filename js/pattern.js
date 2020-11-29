// js 中的, 正则表达式的使用

var pattern = /pages\/(.+)\/(.+)\.js/;
var str = "ikeba-web22/webapck/3/mpa/src/pages/article/ind.js";

var pattern2 = /pages\/(.+)\/.+\.js/;

console.log(pattern.test(str)); // true or false

const p = str.match(pattern);
// if (p !== false);
const [s, t1, t2] = p;
const { index, input, groups } = p;
console.log(p);

const a = str.replace(pattern2);
console.log(a);
