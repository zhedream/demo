// 递归本质还是循环, 目的是迭代指针
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

{
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
  let sum = 0;

  // break
  if (number == 100) return number;

  // continue
  if (number % 2 == 1) {
    // 给奇数层做个处理

    // return run(index + 1); // 展开写, 方便理解

    // 在 奇数 不做处理, 直接传递
    let res = calc(number + 1);
    sum = sum + res;
    return sum;
  }

  // 处理当前层需要返回的结果

  let res = calc(number + 1);

  sum = res + number;

  return sum;
}

let last_sum = calc(1);
console.log("last_res: ", last_sum);
