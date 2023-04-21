type Callback<T> = (data: T) => void;

type RequestState = "pending" | "fulfilled" | "rejected";

class OverTimeError extends Error {}

class AbortError extends Error {}

type RequestItem<T> = {
  fn: (signal: AbortSignal, overTimeSigal: AbortSignal) => Promise<T>;
  callback?: Callback<T>;
  resolve: (value?: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
  state: RequestState;
  retries: number;
  processing?: boolean;
  timeoutId?: ReturnType<typeof setTimeout>;
  signalController: AbortController;
  overTimeController?: AbortController;
};

class RequestQueue {
  private queue: RequestItem<any>[];
  private pending: number;
  private maxPending: number;
  private timeout: number;
  private retryDelay: number;
  private maxRetries: number;

  constructor() {
    this.queue = [];
    this.pending = 0;
    this.maxPending = 7;
    this.timeout = 3000;
    this.retryDelay = 3000;
    this.maxRetries = 3;
  }

  addRequest<T>(
    fn: (signal: AbortSignal) => Promise<T>,
    callback?: Callback<T>
  ): Promise<T> {

    return new Promise((resolve, reject) => {

      reject(new Error("reject22"));


    });

    return new Promise<T>((resolve, reject) => {
      const signalController = new AbortController();

      let item: RequestItem<any> = {
        fn,
        callback,
        resolve,
        reject,
        state: "pending",
        processing: false,
        retries: 0,
        signalController,
        overTimeController: undefined,
      };

      let r = new OverTimeError("test");

      reject("reject22");
      // reject(2)

      this.queue.push(item);
      this.processQueue(item);
    });
  }

  private processQueue<T>(item?: RequestItem<T>): void {
    debugger;
    if (this.pending >= this.maxPending) {
      return;
    }
    const nextRequest =
      item ||
      this.queue.find(
        (request) => !request.processing && request.state === "pending"
      );
    if (!nextRequest) {
      return;
    }
    this.pending++;

    nextRequest.processing = true;

    // 超时终止信号
    const overTimeController = new AbortController();
    const overTimeSigal = overTimeController.signal;
    nextRequest.overTimeController = overTimeController;

    // 普通终止信号
    const signal = nextRequest.signalController.signal;

    nextRequest
      .fn(signal, overTimeSigal)
      .then((data) => {
        this.finishRequest(nextRequest, data);
      })
      .catch((error) => {
        this.handleRequestError(nextRequest, error);
      });
    this.scheduleTimeout(nextRequest);
  }

  private finishRequest<T>(request: RequestItem<T>, data: T): void {
    debugger;
    this.pending--;

    // 返回结果
    request.resolve(data);
    request.callback && request.callback(data);

    // 移出队列
    let index = this.queue.findIndex((v) => v === request);
    this.queue.splice(index, 1);
  }

  private handleRequestError<T>(request: RequestItem<T>, error: Error): void {
    request.processing = false;
    this.pending--;

    new OverTimeError(`OverTimeError`);

    if (request.retries < this.maxRetries) {
      request.retries++;
      console.warn(
        `Request failed, retrying (${request.retries}/${this.maxRetries})`
      );
      setTimeout(() => {
        this.processQueue(request);
      }, this.retryDelay);
    } else {
      console.error(
        `Request failed after ${this.maxRetries} retries: ${error}`
      );
      request.reject(new OverTimeError(`最终超时: ${this.maxRetries}`));

      // 执行下一个
      this.processQueue();
    }
  }

  private scheduleTimeout<T>(request: RequestItem<T>): void {
    request.timeoutId = setTimeout(() => {
      if (request.processing) {
        console.warn(
          `Request timed out after ${this.timeout}ms, retrying (${request.retries}/${this.maxRetries})`
        );
        this.pending--;
        request.processing = false;
        if (request.overTimeController === undefined) {
          throw Error("没有超时控制器 overTimeController");
        }
        // 超时终止
        request.overTimeController.abort();
        clearTimeout(request.timeoutId!);
      }
    }, this.timeout);
  }

  abort(): void {
    this.queue.forEach((request) => {
      const { signalController, state } = request;
      if (request.processing && signalController) {
        signalController.abort();
        request.processing = false;
        clearTimeout(request.timeoutId!);
        if (state === "pending") {
          request.reject(new Error("Request aborted"));
        }
      }
    });
    this.queue.length = 0;
    this.pending = 0;
  }
}

let R = new RequestQueue();

let index = 7;

async function testReq(signal?: AbortSignal, overTimeSigal?: AbortSignal) {
  // 随机 1 - 5, count
  let count = index--;
  console.log("count: ", count);

  return await new Promise<number>((resolve, reject) => {
    signal?.addEventListener("abort", (f) => {
      console.log("abort", f);
      reject(new AbortError("abort"));
    });
    overTimeSigal?.addEventListener("abort", () => {
      reject(new OverTimeError("overTime"));
    });
    setTimeout(() => {
      resolve(count);
    }, 1000 * count);
  });
}

async function testReq2(signal?: AbortSignal, overTimeSigal?: AbortSignal) {
  // 随机 1 - 5, count
  let count = Math.floor(Math.random() * 5 + 1);

  return await new Promise<number>((resolve, reject) => {
    signal?.addEventListener("abort", (f) => {
      console.log("abort", f);
      reject(new AbortError("abort"));
    });
    overTimeSigal?.addEventListener("abort", () => {
      reject(new OverTimeError("overTime"));
    });
    setTimeout(() => {
      resolve(count);
    }, 1000 * count);
  });
}

// R.addRequest<number>(testReq)
//   .then((res) => {
//     console.log("res: ", res);
//   })
//   .catch((err) => {
//     console.log("err: ", err);
//   });

R.addRequest<number>(testReq2)
  .then((res) => {
    console.log("res: ", res);
  })
  .catch((err) => {
    console.log("err: ", err);
  });
