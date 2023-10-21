const enum PromiseState {
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}

function runMicroTask(fn) {
  if (typeof Promise !== "undefined" && Promise.resolve) {
    Promise.resolve().then(fn);
  } else {
    setTimeout(fn, 0);
  }
}
interface Executor {
  (resolve: (data: any) => void, reject: (data: any) => void): void;
}

type Handler = { state: PromiseState; executor; resolve; reject };

function isPromise(p: any) {
  return p && typeof p === "object" && typeof p.then === "function";
}

class MyPromise {
  private _state: PromiseState;
  private _value: any;

  private handlers: Handler[] = [];

  constructor(
    executor: (
      resolve: (data: any) => void,
      reject: (data: any) => void
    ) => void
  ) {
    this._state = PromiseState.PENDING;
    this._value = undefined;
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (error) {
      console.log("error: ", error);
      this._reject(error);
    }
  }

  then(onfulfilled?, onrejected?) {
    return new MyPromise((resolve, reject) => {
      this._pushHandler(onfulfilled, PromiseState.FULFILLED, resolve, reject);
      this._pushHandler(onrejected, PromiseState.REJECTED, resolve, reject);
      this._runHandlers();
    });
  }

  private _pushHandler(executor, state: PromiseState, resolve, reject) {
    this.handlers.push({
      state,
      executor,
      resolve,
      reject,
    });
  }

  private _runHandlers() {
    runMicroTask(() => {
      if (this._state === PromiseState.PENDING) return;
      for (let i = 0; i < this.handlers.length; i++) {
        const handler = this.handlers[i];
        this._runOneHandler(handler);
      }
      this.handlers = [];
    });
  }

  private _runOneHandler(handler: Handler) {
    if (handler.state === this._state) {
      if (typeof handler.executor !== "function") {
        this._state === PromiseState.FULFILLED
          ? handler.resolve(this._value)
          : handler.reject(this._value);
        return;
      }

      try {
        let res = handler.executor.call(undefined, this._value);
        isPromise(res)
          ? res.then(handler.resolve, handler.reject)
          : handler.resolve(res);
      } catch (error) {
        handler.reject(error);
      }
    }
  }

  private _resolve(data) {
    this._changeState(PromiseState.FULFILLED, data);
  }

  private _reject(reason: any) {
    this._changeState(PromiseState.REJECTED, reason);
  }

  private _changeState(state: PromiseState, value: any) {
    if (this._state !== PromiseState.PENDING) return;
    this._state = state;
    this._value = value;
    this._runHandlers();
  }
}

function delay() {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve("delay");
    }, 1000);
  });
}


(async () => {


  console.log("start");

  // @ts-ignore
  let res = await delay();
  console.log('res: ', res);


  


})(); 

// 1. 执行器 和 状态变化

// 2. then 方法

// 执行队列

// 遍历任务队列
