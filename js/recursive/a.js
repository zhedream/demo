

main();



function main() {




  // let path = [];
  // go4([1, 2, 3, 4], 2, 5, 0, []);
  // console.log('path: ', path);
  function go4(arr, count, target, dep, tem_path) {

    if (dep == count && target == 0) {
      path.push([...tem_path]);
      return
    }

    // dep 指针边界
    if (dep == count) return;

    for (let i = 0; i < arr.length; i++) {
      tem_path.push(arr[i])
      // console.log('tem_path: ', tem_path);
      go4(arr, count, target - arr[i], dep + 1, tem_path);
      tem_path.pop()
    }

  }


  go([1, 2, 3, 4], 0, 0, [])

  /**
   * 递归全排列
   * @param {*} arr 
   * @param {*} dep 深度, 外层循环指针
   * @param {*} i 下标, 内层循环指针
   * @param {*} tem_path 
   * @returns 
   */
  function go(arr, dep, i, tem_path) {

    // dep 指针边界
    if (dep == arr.length) return;

    // i 指针边界
    if (i == arr.length) return

    // continue
    if (tem_path.indexOf(arr[i]) > -1) return go(arr, dep, i + 1, tem_path)

    tem_path.push(arr[i])

    console.log('tem_path: ', tem_path);

    // go(arr, dep + 1, 0, tem_path)
    go(arr, dep + 1, i, tem_path)

    tem_path.pop()

    go(arr, dep, i + 1, tem_path)

  }


  // let pp = go3([
  //   ['小米', '华为'],
  //   ['红色', '绿色','蓝色'],
  //   ['64g', '128g'],
  // ], 0, 0, [])

  // console.log('pp: ', pp);

  function go3(data, i, j, tem_path) {


    if (tem_path.length == data.length) return [tem_path.slice(0)]

    // if (i == data.length) return [tem_path.slice(0)]

    if (j == data[i].length) return [tem_path.slice(0)]


    let res = [];

    let a = data[i][j];

    tem_path.push(a)

    // console.log('tem_path: ', tem_path);

    let rt1 = go(data, i + 1, 0, tem_path);

    res = res.concat(rt1);

    tem_path.pop()

    let rt2 = go(data, i, j + 1, tem_path);

    res = res.concat(rt2);

    return res

  }

  // go2([
  //   ['红色', '绿色'],
  //   ['64g', '128g'],
  //   ['小米', '华为']
  // ], 0, [])
  function go2(data, i, tem_path) {

    let res = [];

    if (i == data.length) return;

    let row = data[i];

    for (let j = 0; j < row.length; j++) {

      tem_path.push(row[j])
      console.log('tem_path: ', tem_path);

      go(data, i + 1, tem_path);

      tem_path.pop();

    }

    return res;


  }


  // let pp = go1([1, 2, 3], 0, [])
  // console.log('pp: ', pp);
  function go1(arr, dep, tem_path) {

    if (dep == 3) {
      // path.push([...tem_path])
      return {
        paths: [tem_path.slice()],
        count: 1
      };
    }

    let res = {
      paths: [],
      count: 0,
    } // cur stack

    for (let i = 0; i < arr.length; i++) {

      if (tem_path.indexOf(arr[i]) > -1) continue;

      tem_path.push(arr[i]);

      // console.log('tem_path: ', tem_path);

      let rt = go1(arr, dep + 1, tem_path); // 展开, 多个分支
      console.log('rt: ', rt);


      tem_path.pop(); // 重置状态

      // 处理回溯结果, 聚合过程
      // console.log('rt.paths: ', rt.paths);
      res.paths = res.paths.concat(rt.paths);
      res.count += rt.count;


    }

    return res;
  }


}