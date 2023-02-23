function create2(str) {
  // 生成 1000 个数据
  let arr = [];
  for (let i = 0; i < 10000; i++) {
    arr.push(str);
  }

  return () => arr;
}

function log333() {
  console.log("log333");
}

function log222() {
  console.log("log222");
}

console.log("create2");

log222();

