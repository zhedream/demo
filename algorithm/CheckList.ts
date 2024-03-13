



interface CheckItem {
  x: number;
  y: number;
  key: string;
}


// 异常频率检测 m 个元素，有 n 个异常，则触发回调
// 包括这个点在内的 m 个点之内, 至少有 n 个异常点
// 有一个队列保存最近 m 个点，如果队列中异常点个数大于 n, 则触发回调, 且清空队列

class CheckList<T> {
  private list: T[] = [];
  private errCount: number = 0;

  constructor(
    private checkCount: number,
    private maxErrCount: number,
    private checkError: (item: T) => boolean,
    private callBack: (item: T) => void
  ) {}

  push(item: T) {
    this.list.push(item);

    if (this.list.length > this.checkCount) {
      const removedItem = this.list.shift();
      if (removedItem && this.checkError(removedItem)) {
        this.errCount--;
      }
    }

    if (this.checkError(item)) {
      this.errCount++;
      if (this.errCount === this.maxErrCount) {
        this.callBack(item);
        this.list = [];
        this.errCount = 0;
      }
    }
  }
}


let check = new CheckList<CheckItem>(
  5, 3,
  (item) => {
    let x = item.x + "";
    let y = item.y + "";
    let x1 = x.split(".")[1];
    let y1 = y.split(".")[1];
    const number = 6;
    if (x1 && x1.length < number && y1 && y1.length < number) {
      return true;
    }

  },
  (item) => {
    console.log(`最近一段数据中发现至少 ${3} 个GPS数据精度小于 ${6} ,请检查设备是否正常.`, item);
  }
);


check.push({ x: 116.123412, y: 43.12341, key: "1" });
check.push({ x: 116.123412, y: 43.12341, key: "2" });
check.push({ x: 116.123, y: 43.123, key: "3" });
check.push({ x: 116.123412, y: 43.12, key: "4" });
check.push({ x: 116.12, y: 43.12, key: "5" }); //
check.push({ x: 116.12, y: 43.1, key: "6" });

check.push({ x: 116.123, y: 43.141, key: "7" }); //
check.push({ x: 116.341, y: 43.141, key: "8" });
check.push({ x: 116.341, y: 43.141, key: "9" }); // 
check.push({ x: 116.123412, y: 43.12341, key: "10" });
check.push({ x: 116.12, y: 43.11, key: "11" });
check.push({ x: 116.123412, y: 43.12341, key: "12" });

