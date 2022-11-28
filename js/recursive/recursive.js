
// 递归原理

function main() {

  // 普通写法
  // 普通迭代, 递进的求和方式

  let arr = [1, 2, 3]

  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];
    sum += num;
  }

  console.log(sum);

}


function main1() {

  function reduce(arr, call, def) {

    let res = def;

    arr.forEach(val => {

      res = call(res, val)

    })

    return res;

  }


  console.log(

    // 迭代, 聚合, + 返回聚合
    reduce([1, 2, 3], (acc, item) => {
      return acc + item;
    }, 0)
  );


}





// main2_1()

function main2_1() {

  let sum = 0;

  let arr = [1, 2, 3];


  let head = arr;

  while (head.length) {

    sum += head[0];

    head = head.slice(1);

  }

  console.log(sum);

  return sum;


}

// main2();
function main2() {

  // 递迭代, **封装了 while**, 伪递归,  
  // 只有递, 没有归的过程 
  // 最后由主函数 main 返回了 聚合

  let sum = 0;

  let arr = [1, 2, 3];

  while1(arr);

  function while1(arr) {

    // 处理递归边界, 防止死循环
    if (arr.length == 0) return; // 

    // 递进的处理规程

    sum += arr[0];

    let res = while1(arr.slice(1)); // 迭代

    // 归的处理过程, 通常不处理归过程

    return res;
  }

  console.log(sum);

  return sum;



}

// main2_2() !!!!!!!!!!
function main2_2() {

  let sum = 0;

  let arr = [1, 2, 3];
  //======================= 递归结果
  // 初始 | 初+处理? > 迭 | 归 (初+处理?)+归
  // 初始 | 初+处理? > 迭 | 归 (初+处理?)+归
  // 初始 | 初+处理? > 迭 | 归 (初+处理?)+归 
  // 0  迭代边界 => 递归边界

  // 0 | 1 | 3
  // 0 | 1 | 2
  // 0 | 1 | 1
  // 0 

  // 终于知道为什么 递归难学了, 因为被简化了, 特征都不见了. 之留下精华.
  // 精华虽好, 但食之无味, 却是令人难以下咽.
  // YYDS, JYM, CNM, 对于理解的人, 自然好使
  // 不理解的, 还是展开的才能弄明白.

  function while1(arr) {

    if (arr.length == 0) return 0;

    // 当前调用栈 聚合
    let sum = 0; // 当前栈初始的数据, 闭包, 这个函数调用所占用的内存空间.

    // 入栈过程陈
    sum += 1;

    // 递进过程 什么也没做, 

    let rt = while1(arr.slice(1)); // 底层栈的结果. 底层的 sum; 

    sum += 1; // 

    return sum; // 放回该层, 栈的聚合

  }

  let sum1 = while1(arr);

  // 最终返回的结果 sum1 
  // 是由 每个递归调用栈 数据的聚合处理来的
  // 每层栈, 都有 迭代前处理 + 底层栈结果 + 迭代后处理 

  console.log(sum1);

  return sum1;


}


// main3()
function main3() {



  function while2(arr, sum) {

    // 为什么叫聚合, 因为就像 reduce
    // 进去是数组, 出来可以是数组, 数字,对象等等. 总之就是聚合成一个 数据/变量
    // 输入一个 可迭代数据, 通过递归的方式 , 处理成一个结果

    // 一些边界 return 返回值 
    // 0,1:  数字的计算, 统计之类的, 
    // null:  链表 空指针
    // undefined:  大概率是 只有迭代, 没有归的规程才会返回 undefined

    // 入参:  那就和 reduce 的效果是一样的, 就是单纯的传递"聚合". 就如 本例子 main3


    // 迭代边界
    if (arr.length == 0) return sum;


    // 递前处理: 

    sum += arr[0]


    // 底层的返回值
    let rt_sum = while2(arr.slice(1), sum);

    // 归后处理: 


    sum = rt_sum + arr[0];

    return sum;

  }


  let sum2 = while2([1, 2, 3], 0)


  console.log(sum2);

  return sum2;

}


// main4();
function main4() {

  let arr = [1, 2, 3, 4, 5];


  // 不适用 携带参数
  // 利用 递归特性, 栈, 
  let res = while1(arr)
  console.log('res: ', res);

  function while1(arr) {

    // 边界
    if (arr.length == 1) {
      return arr[0];
    }

    // 递: 初始化数据

    let curSum = arr[0]; // 本层数据


    // 迭代
    let rt_sum = while1(arr.slice(1));

    // 归: 聚合过程

    return curSum + rt_sum;
  }


}



// main5();
function main5() {
  let arr = [1, 2, 3];

  let res = calc(arr)
  console.log('res: ', res);

  function calc(arr) {

    if (arr.length == 1) {
      return arr[0];
    }

    return arr[0] + calc(arr.slice(1));

  }

}


function _while(data) {
  // 1. 边界: 防止死循环. 
  // 如果迭代两指针-维度,那么应该有两边界
  // 返回: 最小问提解
  // 剪枝: 提前返回.
  // 跳过: 迭代下一个指针.
  if (data.length == 0) return 0

  // 2. 递: 递进过程, 指针展开过程, 捕获过程
  // 定义/确认栈数据, 初始化数据,或其他处理

  let curStackAcc = data[0].length;

  // 3.确定展开方向
  // 确认维度: 一个指针一个维度

  // 4. 迭代: 偏移指针, 
  let bottom_stack_acc = _while(data.slice(1)); // 展开方向, 可能有多个分支.

  // 5. 归: 指针回归过程,冒泡过程, 聚合数据, 或其他处理
  curStackAcc += bottom_stack_acc;

  return curStackAcc;
}

// 计算 字符串长度和
console.log(
  _while(['-', '--', '---'])
); // 6

// 递归原理: 递-递进展开,归-回归聚合

// 四部曲:
// 基本边界
// 定义数据
// 确认方向和维度
// 迭代指针
// 回归聚合

// 函数调用栈的聚合过程, 将指针展开

// 非常类似 reduce

// 递归, 就像把 while 循环,封装成函数调用

// 递归迭代, 有其特性 栈, 闭包

// 任何解决方案, 都是重复, 可迭代.

// 任何算法迭代都可相互转化

// for, do/while 和 递归, 递推 之间能转化.