// 递归本质还是循环, 目的是迭代指针
// 两个重要过程, 递-迭代指针, 归-回溯结果

// 1. 我们从 循环开始

// 这是 for 写法, 我们不用
{
  for (let index = 0; index < 10; index++) {
    console.log("index: ", index);
  }
}

// 1. 我们用 while 来对比理解

{
  let index = 0;
  while (index < 10) {
    console.log("index: ", index);
    index++;
  }
}

// while 死循环,

while (true) {
  console.log(123);
}
// 约等于
{
  console.log(123);
}

{
  console.log(123);
}

{
  console.log(123);
}
// .....

// 递归函数 循环

function my_while(flag) {
  console.log(321);
}

// 约等于

{
  console.log(321);
  {
    console.log(321);
    {
      console.log(321);
      {
        console.log(321);
        {
          console.log(321);
        }
      }
    }
  }
}

// 2. 接下来 引入 迭代指针的概念

// while 死循环 + 迭代指针

{
  let index = 0;
  while (true) {
    console.log("index: ", index);
    index++;
  }
}

// 递归函数 死循环 + 迭代指针

{
  // 版本 1, 外部迭代指针
  let index = 0;
  function my_while() {
    console.log("index: ", index);
    index = index + 1;
    my_while();
  }
}

{
  // 版本 2, 内部迭代指针
  function my_while(index) {
    console.log("index: ", index);
    let next_index = index + 1; // 不能忽略, 栈帧
    my_while(next_index);
  }
  my_while(0);
}

// 3. 接下来 就是 break 和 递归边界

// while 循环 + 迭代指针 + break

{
  let index = 0;
  while (true) {
    console.log("index: ", index);
    if (index == 3) break;
    index++;
  }
}

// 递归函数 循环 + 迭代指针 + return

{
  // 版本 1, 外部迭代指针
  let index = 0;
  function my_while() {
    console.log("index: ", index);
    index = index + 1;
    // my_while()  // 不能写 return 前面, 不然写了个寂寞
    if (index == 3) return;
    my_while();
  }
}

{
  // 版本 2, 内部迭代指针
  function my_while(index) {
    console.log("index: ", index);
    let next_index = index + 1; // 不能忽略, 栈帧
    if (next_index == 3) return;
    my_while(next_index);
  }
  my_while(0);
}

// 没错以上, 就是 递归函数 递-迭代指针的过程

// 4. 接下来, 我们来看看 归 ,回溯, 往回传递的过程

{
  // 版本 2, 内部迭代指针
  function my_while(index) {
    let next_index = index + 1; // 不能忽略, 栈帧
    if (next_index == 4) return "挖到一个钻石"; //
    let res = my_while(next_index);
    console.log("res: ", res); // 归的结果
    // return; //
    return res; // 还是要继续传递的
  }
  let last_res = my_while(0);
  console.log("last_res: ", last_res);
}

// 5. 最后 递归: 核心五步, 展开演示 和 练习, 各种形式的,  渐进式的

// 递归的最精髓的, 也是递归的特点, 就是回溯结果的过程

// 分析规律
// 栈帧数据
// 递归边界
// 迭代指针
// 回溯结果

// 练习 迭代指针 和 递归边界
// 问题1: 1 到 100 的和
// 问题2: 1 到 100 的 偶数和
