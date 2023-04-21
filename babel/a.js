/* 

你是 js 工程师 你会babel, 你将帮助我转换 代码. 
你将教会我如何使用 babel, 并使用 ast , 进行代码的增删改
从而实现我的自定义代码转换需求

*/



var code = `
import { findPath, find2 } from "javascript/treeHelper.m.js";
console.log(123);
export const a = 1;
`;

var nextCode = `
const { findPath, find2 } = await loadModule("javascript/treeHelper.m.js");
// ... 其他代码
`;
// 需要你将 import from  转换为  await loadModule 的形式
// babel 实现过程
//  生成 ast
//  生成新的代码 newCode
//  打印 code 和 nextCode
// 请写出完整实现, 请使用 @babel/parser  @babel/generator 等工具完成


var code = `
import * as treeHelper from "javascript/treeHelper.m.js";
import { findPath, find2 } from "javascript/treeHelper.m.js";
import Menu,{item,item2} from 'javascript/menu.m.js';
console.log(123);
export const a = 1;
`;

var nextCode = `
const treeHelper = await loadModule("javascript/treeHelper.m.js");
const { findPath, find2 } = await loadModule("javascript/treeHelper.m.js");
const Menu = await loadModule("javascript/menu.m.js").default;
const {item,item2} = await loadModule("javascript/menu.m.js");
// ... 其他代码
`;