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

// 验证手机号

var pattern = /^1[34578]\d{9}$/;

// 验证座机号
var pattern = /[0-9]{3,4}[-][0-9]{8}/;
var pattern = /\d{3,4}[-]\d{8}/;

// 手机或座机
var pattern = /^1[34578]\d{9}$|^[0-9]{3,4}[-][0-9]{8}$/;

// 密码强度: 对应的验证规则是：密码中必须包含字母、数字、特称字符，至少8个字符，最多30个字符。
var regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}');
console.log(regex.test('a123456-'));