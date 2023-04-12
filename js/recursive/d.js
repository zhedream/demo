// 递归其实还是循环, 目的是迭代指针
// 两个重要过程, 递-迭代指针, 归-回溯结果

// 分析规律  栈帧数据  递归边界 迭代指针 回溯结果

// 练习 迭代指针 和 递归边界

// 问题: 1 到 100 的 偶数和

let sum = 0;

// 1 - 100 偶数和
for (let i = 1; i <= 100; i++) {
  if (i % 2 == 0) {
    sum += i;
  }
}
console.log("sum: ", sum);

// 模拟递归
{
  // 栈帧数据
  let arr = [];

  // 递-迭代指针/展开数据
  for (let i = 1; i <= 100; i++) {
    arr.push(i);
  }

  // 归-回溯结果/聚合结果
  let ss = arr.reduce((acc, number) => {
    let sum = 0;

    if (number % 2 == 0) {
      sum = acc + number;
    } else {
      sum = acc;
    }

    return sum;
  }, 0);

  console.log("ss: ", ss);
}

function calc(number) {

  // 当前栈帧数据:  每调一次函数, 会在内存中开辟一个栈帧
  let sum = number; // 相当于 arr.push

  // break
  if (number == 100) return number;

  // continue
  if (number % 2 == 1) {
    // 给奇数层做个处理

    // return calc(number + 1); // 展开写, 方便理解

    // 在 奇数 不做处理, 直接传递
    let res = calc(number + 1);

    // 本来是要聚合本层数据, 但是奇数层不做处理, 所以直接返回
    // sum = sum + res;
    // return sum;

    return res;
  
  }

  // return number + calc(number + 1);

  // 展开写! 原来如此这次我理解栈帧了

  // console.log("进入下一层");

  // 迭代指针, 展开数据, 进入下一层
  let res = calc(number + 1);

  // console.log("回来了. 拿到了下一层的结果", res);

  // 处理当前层数据
  sum = res + number; // 相当于 reduce 聚合结果

  // 返回单前层数据
  return sum;
}

let last_sum = calc(1);
console.log("last_res: ", last_sum);
