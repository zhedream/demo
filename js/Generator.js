

let arr = {
  list: [1, 2, 3],
  index: 0,
  next() {
    if (this.index < this.list.length) {
      return {
        value: this.list[this.index],
        done: this.index++ > this.list.length
      }
    }
    return {
      value: undefined,
      done: true
    }
  },
  [Symbol.iterator]: function () {
    // ========= 直接返回自身, 自身就符合可迭代协议, next
    // return this;
    // ======= 返回
    return {
      index: 0,
      list: this.list,
      next() {
        if (this.index < this.list.length) {
          return {
            value: this.list[this.index],
            done: this.index++ > this.list.length
          }
        }
        return {
          value: undefined,
          done: true
        }
      }
    }

    // ========== 更好的方法, 利用闭包
    // let index = 0;
    // let list = this.list;
    // return {
    //   next() {
    //     return {
    //       value: list[index],
    //       done: index > list.length
    //     }
    //   },
    // }
  },
}


for (const iterator of arr) {
  console.log('iterator: ', iterator);
}

function gArr1(arr) {
  let index = 0;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      return {
        value: arr[index],
        done: ++index > arr.length
      }
    },
  }
}

function gArr2(arr) {
  let index = 0;
  return {
    [Symbol.iterator]() {
      return {
        next() {
          return {
            value: arr[index],
            done: ++index > arr.length
          }
        },
      };
    },

  }
}

function* gArr3(arr) {
  for (let index = 0; index < arr.length; index++) {
    yield arr[index];
  }
}

function* a() {

  yield* gArr2([1, 2, 34])

}

let ii = a();

for (const iterator of ii) {
  console.log('iterator: ', iterator);

}