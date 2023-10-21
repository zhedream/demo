function runMicroTask(fn) {
  setTimeout(fn, 0);
}

function isPromise(p) {
  return p && typeof p === "object" && typeof p.then === "function";
}

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise2 {
  constructor(excutor) {
    this._state = PENDING;
    this._value = undefined;
    this._list = [];

    try {
      excutor(this._resolve.bind(this), this._reject.bind(this));
    } catch (error) {
      this._reject(error);
    }
  }

  _changeState(state, value) {
    if (this._state !== PENDING) return;
    this._state = state;
    this._value = value;
    this._runList();
    
  }

  _resolve(data) {
    this._changeState(FULFILLED, data);
  }

  _reject(data) {
    this._changeState(REJECTED, data);
  }

  then(onfullfilled, onrejected) {
    return MyPromise2((res, rej) => {
      this._pushList(onfullfilled, FULFILLED, res, rej);
      this._pushList(onrejected, REJECTED, res, rej);
      this._runList();
    });
  }

  _pushList(fn, state, res, rej) {
    this._list.push({
      fn,
      state,
      res,
      rej,
    });
  }

  _runList() {
    if (this._state === PENDING) return;
    this._list.forEach((item) => {
      this._runItem(item);
    });
    this._list = [];
  }

  _runItem(item) {
    if (item.state !== this._state) return;

    if (typeof item.fn !== "function") {
      this._state == FULFILLED ? item.res(this._value) : item.rej(this._value);
      return;
    }

    try {
      let res = item.fn.call(undefined, this._value);
      isPromise(res) ? res.then(item.res, item.rej) : item.res(this.value);
    } catch (error) {
      item.rej(error);
    }
  }
}
