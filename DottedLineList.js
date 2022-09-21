class DottedLineList {
  constructor(id = "", call) {
    this.id = id;
    this.list = [];
    this.call = call;
  }

  add(v) {
    const len = this.list.length;
    // 正常
    if (this.check(v)) {
      switch (len) {
        // 空, 添加
        case 0:
          this.list.push(v); // [1]
          break;
        // 存在, 替换
        case 1:
          this.list[0] = v; // [1] -> [1.0]
          break;
        // 找到组合 [1,0]
        case 2:
          // 找到组合 a,b
          this.onFind(this.list[0], v);
          this.list.length = 0; // [1,0] -> []
          this.list.push(v); // [1,0] -> [1]
          break;
        default:
          break;
      }
    }
    //异常
    else {
      switch (len) {
        case 1:
          this.list.push(v); // [1] -> [1,0]
          break;
        case 2:
          this.list[1] = v; // [1,0] -> [1,0.0]
        default:
          break;
      }
    }
  }

  check(v) {
    return !!v.value;
  }

  onFind(a, b) {
    this.call && this.call(a, b);
  }
}

let arr = [0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1].map((v, i) => {
  return { value: v, index: i };
});

const call = (a, b) => {
  console.log("a,b: ", a, b);
};

let demo = new DottedLineList("demo", call);

console.log("arr: ", arr);

arr.forEach((v) => {
  demo.add(v);
});
