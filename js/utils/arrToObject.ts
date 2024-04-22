// 对象数组, 转对象

let arr = [
  {
    key: "vcdsaga",
    label: "2020-03-03测试图片1",
    count: 1,
  },
  {
    key: "a015",
    label: "",
    count: 2,
  },
  {
    key: "asdgsa",
    label: "测试图谱2",
    count: 3,
  },
];

let map = toObj(arr, "key");

// let a = toObj(arr, 'key', 'label');
// let a = toObj(arr, 'key', ['label', 'key']);
// let a = toObj(arr, 'key', ['label', 'key'], true);
console.log(map);

/**
 * 数组转对象
 * @param {[{}]} arr  对像数组
 * @param {string} key  键
 * @param {string | [string]} keys
 * @param {boolean} flag 反选, 仅 keys 为数组时, 不选的标志
 */
function toObj(arr, k, keys?, flag = false) {
  if (keys === undefined) {
    keys = [];
    flag = true;
  }
  let object = {};
  if (typeof keys == "string") {
    return arr.reduce((acc, item, index, _) => {
      acc[item[k]] = item[keys];
      return acc;
    }, {});
  }
  arr.forEach((item) => {
    let key = item[k];
    let value = {};
    if (flag == true) {
      // 排除 keys
      Object.keys(item).forEach((key) => {
        if (keys.includes(key) == false) value[key] = item[key];
      });
    } else {
      // 保留 keys
      keys.forEach((key) => {
        value[key] = item[key];
      });
    }
    object[key] = value;
  });
  return object;
}

/**
 * 数据转对象, 字典映射
 * @param {*} arr
 * @param {*} key
 * @returns
 */
function toObj1(arr, key) {
  let ResObj = {};
  arr.forEach((RowObj) => {
    ResObj[RowObj[key]] = RowObj;
  });
  return ResObj;
}

/**
 * 数据转对象, 字典映射
 * @param {*} arr
 * @param {*} key
 * @param {*} key2
 * @returns
 */
function toObj2(arr, key, key2) {
  let ResObj = {};
  arr.forEach((RowObj) => {
    ResObj[RowObj[key]] = RowObj[key2];
  });
  return ResObj;
}

/*

let arr = [
    { key: 'a' },
    { key: 'b' },
    { key: 'c' },
    { key: 'd' },
    { key: 'e' },
]
let arrMap = arr.reduce((acc, item, index, _) => {
    acc[item.key] = index
    return acc
}, {})

console.log(arrMap);

let headerMap = {};
arr.forEach((item, index) => headerMap[item.key] = index)

console.log(headerMap);


*/

type FnOrKey<T> = (item: T) => any | keyof T;

// 分组： _.groupBy
export function groupBy<T>(array: Array<T>, funcOrKey: FnOrKey<T>) {
  const f = (item: T) =>
    funcOrKey instanceof Function ? funcOrKey(item) : item[funcOrKey];
  let result: Record<string, Array<T>> = {};
  for (let i = 0; i < array.length; i++) {
    let item = array[i];
    let key: string = f(item);
    if (result[key] === undefined) {
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
}

// 分区： _.partition
function partition<T>(data: T[], fnOrKey: FnOrKey<T>) {

  const fn = (item: T) =>
    fnOrKey instanceof Function ? fnOrKey(item) : item[fnOrKey];

  let result = [];
  let fnKeyIndexMap = {}; // fnKey 所在分区索引
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let fnKey = fn(item);

    if (fnKeyIndexMap[fnKey] === undefined) {
      fnKeyIndexMap[fnKey] = result.length; // key 所在分区索引
      result.push([]); // 新分区
    }
    result[fnKeyIndexMap[fnKey]].push(item);
  }
  return result;
}

function partitionWithObject<T>(
  data: T[],
  fnOrKey: FnOrKey<T>,
  titleKey = "title",
  dataKey = "data"
) {
  const fn = (item: T) =>
    fnOrKey instanceof Function ? fnOrKey(item) : item[fnOrKey];

  let result: any[] = [];
  let fKeyIndex = {};
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let fKey = fn(item);
    if (fKeyIndex[fKey] === undefined) {
      fKeyIndex[fKey] = result.length;
      result.push({
        [titleKey]: fKey,
        [dataKey]: [],
      });
    }

    result[fKeyIndex[fKey]][dataKey].push(item);
  }
  return result;
}
