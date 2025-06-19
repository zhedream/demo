// 递归 递归是一种循环

// 所有的循环可以相互转化：for、while、dowhile、递归

// 递归
// 递：递进迭代、迭代器，迭代数据 的过程
// 归：回归聚合、聚合器，聚合数据 的过程
// 递归循环，拥有函数调用栈特性：函数调用栈是函数调用时，临时存储的栈结构，用于存储函数调用的参数、局部变量、返回值等上下文信息。


// 演示：迭代指针，用循环 与递归的 方式 实现

// let stack = []

// for (let index = 0; index < 10; index++) {
//   stack.push(index)
// }

// console.log(stack);

// const sum = stack.reduceRight((acc, index) => {
//   console.log(index, 'index');
//   return acc + index
// }, 0)

// console.log(sum);

function go(index) {
  if (index < 10) { }
  else {
    // 终止条件
    return 0
  }
  console.log(index);
  let acc = go(index + 1)// 迭代一次指针，执行一次函数，就会创建有一个函数栈，里面存有数据。

  // 回归过程
  acc = acc + index

  return acc
}


// 为什么学不懂
function go2(index) {
  if (index >= 10) return 0;
  return index + go2(index + 1)
}

// [{ index: 0 }, { index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }, { index: 5 }, { index: 6 }, { index: 7 }, { index: 8 }, { index: 9 }]

let sum = go(0)

console.log(sum);
