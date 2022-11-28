

// 给一个环形墙面涂颜色.
// 相邻不能是相同的颜色.


let colors = ['red', 'green', 'blue'];


let path = [];

// go1(5, []);
// console.log('path.length: ', path.length);
// console.log('path: ', path);
/**
 * 
 * @param {*} size 前面大小
 * @param {*} tem_path 
 * @returns 
 */
function go1(size, tem_path) {

  // 边界: size 指针, 墙面用完了
  if (size === 0) {
    path.push(tem_path.slice(0))
    return;
  }

  // 确定展开方向
  let nextColors = [];
  if (tem_path.length > 0) {
    nextColors = colors.filter(v => {
      if (v === tem_path.slice(-1)[0]) return false; // 不能和前一个相同的颜色
      if (size === 1 && v === tem_path[0]) return false; // 最后一款不能和第一块相同
      return true;
    })
  } else {
    nextColors = colors.slice(0);
  }

  // 开始展开
  for (let i = 0; i < nextColors.length; i++) {

    tem_path.push(nextColors[i]);
    go(size - 1, tem_path);
    tem_path.pop();

  }

  // 归: 这里不需要 归处理

}



// go2(5, colors.length - 1, [])
// console.log('path.length: ', path.length);
// console.log('path: ', path);

function go2(size, i, tem_path) {

  if (size === 0) {
    path.push(tem_path.slice(0))
    return;
  }

  if (i === -1) return; // i 指针 -1 才是边界
  // 跳过-continue: 不能和前一个相同
  if (colors[i] == tem_path.slice(-1)[0]) return go(size, i - 1, tem_path);
  // 跳过-continue:  最后一个不能和第一个相同
  if (size === 1 && colors[i] == tem_path[0]) return go(size, i - 1, tem_path);

  // 迭代, size , 深度

  tem_path.push(colors[i]);
  go(size - 1, colors.length - 1, tem_path); // 迭代
  tem_path.pop();

  // 归: 切换方向继续
  go(size, i - 1, tem_path);

}

go3()
function go3() {

  let size = 5;

  let s = [3,]


}