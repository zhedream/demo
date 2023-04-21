class Controler {
  // 取消信号 只能同时存在一个, 竞争资源
  private signalController: AbortController | null = null;

  /**
   * 获取历史数据
   * @description 必须使用 await 等待,  存在 signalController 资源争夺
   */
  async setHistory() {
    // 新建信号
    this.signalController = new AbortController();
    let signal = this.signalController.signal;

    let g = this.getHistoryLidarData(signal);
    signal.addEventListener("abort", () => {
      console.log("setHistory 取消 g");
      g.return();
    });

    for await (const lidarData of g) {
      console.log("lidarData", lidarData);

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 1000);
      });
    }

    console.log("结束11111111");
  }

  async startRealTime() {
    await this.setHistory();
    // 开启轮询
  }

  // === 获取历史数据
  private async *getHistoryLidarData(signal: AbortSignal) {
    let pages = this._getHistoryPage(signal);
    signal.addEventListener("abort", () => {
      console.log("取消信号222222");
      pages.return();
    });

    let index = 0;

    for await (let data of pages) {
      console.log("Page:index", index++);

      // 数据处理
      data = data.map((v) => {
        return v * 2;
      });

      for (let index = 0; index < data.length; index++) {
        // 每一条数据
        yield data[index];
      }
    }
    console.log("结束22222");
  }

  /**
   * 接口请求
   * @param data
   * @param signal
   * @returns
   */
  private GetData(data: any, signal: AbortSignal) {
    return new Promise<number[]>((resolve, reject) => {
      signal.addEventListener("abort", () => {
        console.log("GetData abort");
        reject("取消请求");
      });

      setTimeout(() => {
        resolve([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      }, 1000);
    });
  }

  // 获取历史数据, 分页 by: TaskID code
  private async *_getHistoryPage(signal: AbortSignal) {
    let index = 0;

    while (true) {
      if (index++ === 3) return;

      let data1 = {
        TaskID: "007a46ca-79b9-4207-9ba6-6ed034c4c222",
        PollutantCode: ["a05024"], // "a05024"
        // pageSize: 200,
        // pageIndex: pageIndex++,
      };

      let e = await this.GetData(data1, signal)
        .then((res) => res)
        .catch((err) => {
          console.warn("err", err);
          return Error(err);
        });

      if (e instanceof Error) return;

      yield e;

      // let res = e.data;
      // let requstresult = res.requstresult;
      // if (requstresult !== "1") {
      //   return;
      // }
      // let data = res.data;
      // yield data.Data;
      // if (data.IsEnd) {
      //   return;
      // }
    }
  }

  destroy() {
    if (this.signalController) {
      this.signalController.abort();
      this.signalController = null;
    }
  }
}

let f = new Controler();

f.setHistory();

setTimeout(() => {
  f.destroy();
}, 3000);
