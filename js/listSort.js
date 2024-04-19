var list = [
  { name: "上海", code: "shanghai" },
  { name: "西安", code: "xian" },
  { name: "深圳", code: "shenzhen" },
  { name: "北京", code: "beijing" },
];

let order = ["beijing", "xian", "shanghai", "shenzhen"];

// 根据order的顺序，把list中的数据按照order的顺序排列
function sort1(list, order) {
  list.sort((a, b) => {
    return order.indexOf(a.code) - order.indexOf(b.code);
  });
}

let order2 = [
  { name: "上海", code: "shanghai", index: 0 },
  { name: "西安", code: "xian", index: 1 },
  { name: "深圳", code: "shenzhen", index: 4 },
  { name: "北京", code: "beijing", index: 3 },
];

// order2 转对象 code 到 index
let order3 = order2.reduce((acc, cur) => {
  acc[cur.code] = cur.index;
  return acc;
}, {});

console.log("order3: ", order3);

// 根据order3的顺序，把list中的数据按照order3的顺序排列
function sort2(list, order3) {
  list.sort((a, b) => {
    return order3[a.code] - order3[b.code];
  });
}

sort2(list, order3);

console.log("list: ", list);

// 多字段排序
list.sort((a, b) => {
  if (a.code !== b.code) {
    return order3[a.code] - order3[b.code];
  } else if (a.name !== b.name) {
    return a.name.localeCompare(b.name);
  } else {
    return 0;
  }
});

var arr = [3, 5, 7, 1, 2, 9, 8];

var fields = [1, 7, 2];
var fieldsObjIndex = fields.reduce((acc, cur, index) => {
  acc[cur] = index;
  return acc;
}, {});

var a = arr.sort((a) => {
  // fields 中的数据 排在前面
  if (~fields.indexOf(a)) return -1;
  // 其他保持
  else return 0;
});

arr.sort((a, b) => {
  // a = a.PollutantCode;
  // b = b.PollutantCode;
  let aIndex = fieldsObjIndex[a];
  let bIndex = fieldsObjIndex[b];
  if (~aIndex && ~bIndex) return aIndex - bIndex;
  else return 0;
});

console.log("a: ", a);

// let sorts = [
//   {
//     key: "code",
//     order: "desc",
//     type: "string", // string, number,
//   },
// ];

function sortList(data, sorts, getVal) {
  return data.sort((a, b) => {
    for (let sort of sorts) {
      let { key, order } = sort;
      let aElement = getVal ? getVal(a, key) : a[key];
      let bElement = getVal ? getVal(b, key) : b[key];
      if (aElement !== bElement) {
        if (
          sort.type === "number" ||
          typeof aElement === "number" ||
          !isNaN(aElement)
        ) {
          return order === "asc" ? aElement - bElement : bElement - aElement;
        } else {
          aElement += "";
          bElement += "";
          return order === "asc"
            ? aElement.localeCompare(bElement)
            : bElement.localeCompare(aElement);
        }
      }
    }
    return 0;
  });
}
