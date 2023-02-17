// 从 0 开始, 编程世界的起源
// 背景: 新手如何快速理解 基础概念, 以及如何快速上手编程

// 程序员的工作就是 管理 代码, 设计顶层思路, 底层实现

// 结构化思维, 领导思维

// === 指令

// 简单理解 指令就是一行代码, 一条语句, 一条指令, 一个函数

console.log("玉米好吃");
console.log("玉米好吃");
console.log("玉米好吃");
// ...

// === 变量出现了
// 背景: 复用数据

var a = "地瓜";
console.log(a + "好吃");
console.log(a + "好吃");
console.log(a + "好吃");

// === 循环出现了
// 背景: 重复一组指令

var a = "西瓜";

for (let i = 0; i < 10; i++) {
  console.log(i);
}

// {} 重复代码块

// === 函数出现了
// 背景: 复用一组指令, 功能

// 程序

let a = 1;
let b = 2;
let c = a + b;

function sum(a, b) {
  return a + b;
}

// === 于此同时, 对象,结构体出现了
// 背景: 数据太多杂乱, 无法维护, 对其分类管理
// 作用: 把一类数据放在一起

let obj = {
  a: 1,
  b: 2,
};

// === 于此同时, 数组,集合等基本数据结构 和算法 出现了
// 背景: 为了更好的管理 [增删改查,传输] 数据

// === 类出现了
// 背景: 复用功能组, 一类功能/任务 的复用
let taskID = "taskID";

let taskData = null;

function getTaskData(id) {
  taskData = {};
}

function render(data) {
  console.log("渲染数据");
}

function clear() {
  console.log("清理图层");
  console.log("清除数据");
}

// 字面量的数据, 会被复制一份, 会占用内存

// 函数的字面量数据, 会被复制一份, 会占用内存

function create() {
  let task = {
    id: "taskID",
    data: null,
  };
  return task;
}

let task1 = create();
let task2 = create();

console.log(task1 === task2); // false

getTaskData(task1); // task1 ≈ this 指向块内存区域
getTaskData(task2);

render(task1);

// 两个任务呢?  复用! 函数能够复用, 但是数据不能复用

class Task {
  constructor(id) {
    this.id = id;
    this.data = null;
  }
  getTaskData() {
    this.data = {};
  }
  render() {
    console.log("渲染数据");
  }
  clear() {
    console.log("清理图层");
    console.log("清除数据");
  }
}

// ... 抽象,模拟,封装,继承,多态, 各种设计模式, 都是为了维护, 复用, 优化代码

// 围绕着数据,功能, 对输入,处理,输出 进行分类, 以便于维护, 复用, 优化代码

// 输入,处理,输出
//  输入, 理解, 解析层
//  数据维护层
//  输出, 表达层

// 在后面, 控制器, 工厂
