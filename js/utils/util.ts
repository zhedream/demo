

// 数组去重
let obj = {};
var arr = arr.reduce(function (item, next) {
  obj[next.PollutantCode]
    ? ""
    : (obj[next.PollutantCode] = true && item.push(next));
  return item;
}, []);


/**
 * 获取数据类型
 * @param {*} value
 * @return {string} String Array Object Boolean 等
 */
const _toString = Object.prototype.toString;
const toRowType = function toRowType(value) {
  _toString.call(value).slice(8, -1);
};

// 生成随机字符

Math.random().toString(36).substr(2);

URL.createObjectURL(new Blob()).substr(-36);



function get_centerNumber_index(total, count, index) {
  let centerNumber = total / count;
  return centerNumber * (index + 1) - centerNumber / 2;
}

// 统计 data key 次数
function get_key_count(data, key) {
  let key_count = {};
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    if (key_count[item[key]]) {
      key_count[item[key]]++;
    } else {
      key_count[item[key]] = 1;
    }
  }
  return key_count;
}

// 统计 data key 次数
function get_key_count_array(data, key) {
  let keys_count_array: any[] = [];
  let key2Index = {};

  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let key_value = item[key];
    if (!key_value) {
      key_value = "未知";
    }
    if (key2Index[key_value] === undefined) {
      let index = keys_count_array.length;
      key2Index[key_value] = index;
      keys_count_array.push({
        name: key_value,
        value: 1,
      });
    } else {
      keys_count_array[key2Index[key_value]].value++;
    }
  }
  return keys_count_array;
}

/**
 * 判断非空 '' null undefined
 * @param value
 * @returns {boolean}
 */
function notEmpty(value) {
  switch (value) {
    case "":
    case null:
    case undefined:
      return false;
    default:
      return true;
  }
}

function isEmpty(value) {
  return !notEmpty(value);
}



/**
 * 函数劫持 后置钩子
 * @param fn 被劫持的函数
 * @param hook 劫持函数
 * @param hookReturn 是否劫持返回值, 开启 lazy 强制使用劫持返回值
 * @param lazy 是否懒执行, 开启后, hook 函数的参数为 nextFn， 调用 nextFn() 执行原函数
 */
export function hookFunction(
  fn: Function,
  hook: Function,
  hookReturn = false,
  lazy = false
) {
  return function () {
    const args = Array.prototype.slice.call(arguments);
    if (lazy) {
      // @ts-ignore
      return hook(args, fn, this);
    } else {
      // @ts-ignore
      const result: any = fn.apply(this, args);
      let hookResult = hook(args, result);
      return hookReturn ? hookResult : result;
    }
  };
}

/**
 * 安全获取数据
 * @param {*} data
 * @param {*} keys
 */
export function safeGetData(data: any, keys: string[]) {
  return keys.reduce(
    (item, key) => (item && item[key] != undefined ? item[key] : undefined),
    data,
  );
}

// _.set

/**
 * JSON 深拷贝
 * @param {*} data
 */
export function cloneJson<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// _.cloneDeep

export async function runTask(call: Function, signal?: AbortSignal) {
  await new Promise<void>((resolve) => {
    _runTask(call, resolve, signal);
  });
}

function _runTask(fn: Function, resolve: Function, signal?: AbortSignal) {
  let now = Date.now();

  requestAnimationFrame(() => {
    if (signal?.aborted) {
      console.log("task abort");
      return resolve();
    }
    let time = Date.now() - now;
    if (time < 16.6) {
      fn();
      resolve();
    } else {
      _runTask(fn, resolve, signal);
    }
  });
}


export function runTaskGenerator<G extends Generator>(g: G | (() => G), options?: IdleRequestOptions) {
  if (typeof g === "function") {
    g = g();
  }
  runGenerator(g, options);
}

function runGenerator<G extends Generator>(g: G, options?: IdleRequestOptions) {
  const doIdleWork: IdleRequestCallback = (deadline) => {
    let r: IteratorResult<any>;
    do r = g.next(); while (deadline.timeRemaining() > 0 || deadline.didTimeout);
    if (r.done === false) requestIdleCallback(doIdleWork, options);
  };
  requestIdleCallback(doIdleWork, options);
}